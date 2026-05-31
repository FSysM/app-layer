import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaService } from '../kafka/kafka.service';
import { FileManagerService } from '../filemanager/filemanager.service';
import { NotificationEvent } from '../kafka/notification.events';
import type { ReviewPayload, FilePayload } from '../kafka/notification.events';
import { ReviewFileUploadUrlDto } from './dto/file-upload-url.dto';
import { ReviewFileConfirmDto } from './dto/file-confirm.dto';

type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
type ReviewType = 'SUPERVISOR' | 'OPPONENT';

const REVIEW_SELECT = {
  id: true,
  grade: true,
  comment: true,
  type: true,
} as const;

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private fileManager: FileManagerService,
    private kafka: KafkaService,
  ) {}

  async getReviewsBySubmission(submissionId: string) {
    return this.prisma.review.findMany({
      where: { submissionId },
      select: REVIEW_SELECT,
    });
  }

  async createReview(data: {
    submissionId: string;
    reviewerId: string;
    grade: Grade;
    comment?: string;
    type: ReviewType;
  }) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: data.submissionId },
      select: {
        status: true,
        topic: true,
        assignment: { select: { studentId: true } },
      },
    });

    if (!submission || submission.status !== 'COMPLETED') {
      throw new BadRequestException('Submission must be approved before writing a review');
    }

    const result = await this.prisma.review.create({ data: data as any, select: REVIEW_SELECT });

    const reviewer = await this.prisma.user.findUnique({ where: { id: data.reviewerId }, select: { name: true } });

    if (submission.assignment.studentId) {
      this.kafka.emit(NotificationEvent.REVIEW_CREATED, {
        recipientIds: [submission.assignment.studentId],
        actorName: reviewer?.name ?? 'Teacher',
        entityId: result.id,
        entityType: 'review',
        reviewType: data.type,
        submissionTopic: submission.topic,
      } satisfies ReviewPayload);
    }

    return result;
  }

  async updateReview(reviewId: string, userId: string, data: { grade: Grade; comment?: string }) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: {
        reviewerId: true,
        type: true,
        submission: {
          select: {
            topic: true,
            assignment: { select: { studentId: true } },
          },
        },
      },
    });
    if (!review) throw new NotFoundException('Review not found');
    if (review.reviewerId !== userId) throw new ForbiddenException('You can only edit your own reviews');

    const result = await this.prisma.review.update({ where: { id: reviewId }, data, select: REVIEW_SELECT });

    const reviewer = await this.prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
    const studentId = review.submission.assignment.studentId;

    if (studentId) {
      this.kafka.emit(NotificationEvent.REVIEW_EDITED, {
        recipientIds: [studentId],
        actorName: reviewer?.name ?? 'Teacher',
        entityId: reviewId,
        entityType: 'review',
        reviewType: review.type as ReviewType,
        submissionTopic: review.submission.topic,
      } satisfies ReviewPayload);
    }

    return result;
  }

  async deleteReview(reviewId: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: {
        reviewerId: true,
        type: true,
        submission: {
          select: {
            topic: true,
            assignment: { select: { studentId: true } },
          },
        },
      },
    });
    if (!review) throw new NotFoundException('Review not found');
    if (review.reviewerId !== userId) throw new ForbiddenException('You can only delete your own reviews');

    const result = await this.prisma.review.delete({ where: { id: reviewId }, select: REVIEW_SELECT });

    const reviewer = await this.prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
    const studentId = review.submission.assignment.studentId;

    if (studentId) {
      this.kafka.emit(NotificationEvent.REVIEW_DELETED, {
        recipientIds: [studentId],
        actorName: reviewer?.name ?? 'Teacher',
        entityId: reviewId,
        entityType: 'review',
        reviewType: review.type as ReviewType,
        submissionTopic: review.submission.topic,
      } satisfies ReviewPayload);
    }

    return result;
  }

  // ── File management ────────────────────────────────────────────────────────

  async getFileUploadUrl(reviewId: string, dto: ReviewFileUploadUrlDto, reviewerId: string) {
    const review = await this.ensureReviewerOwnsReview(reviewId, reviewerId);
    return this.fileManager.getUploadUrl(review.submissionId, 'REVIEWS', dto.filename, dto.contentType);
  }

  async confirmFileUpload(reviewId: string, dto: ReviewFileConfirmDto, reviewerId: string) {
    const review = await this.ensureReviewerOwnsReview(reviewId, reviewerId);
    const file = await this.fileManager.confirmUpload({
      key: dto.key,
      filename: dto.filename,
      contentType: dto.contentType,
      folder: 'REVIEWS',
      submissionId: review.submissionId,
      reviewId,
      uploadedById: reviewerId,
      size: dto.size,
    });

    const reviewer = await this.prisma.user.findUnique({ where: { id: reviewerId }, select: { name: true } });
    const studentId = review.submission.assignment.studentId;

    if (studentId) {
      this.kafka.emit(NotificationEvent.FILE_UPLOADED, {
        recipientIds: [studentId],
        actorName: reviewer?.name ?? 'Teacher',
        entityId: file.id,
        entityType: 'file',
        filename: dto.filename,
        submissionTopic: review.submission.topic,
      } satisfies FilePayload);
    }

    return file;
  }

  async deleteReviewFile(reviewId: string, fileId: string, reviewerId: string) {
    const review = await this.ensureReviewerOwnsReview(reviewId, reviewerId);

    const file = await this.prisma.submissionFile.findUnique({
      where: { id: fileId },
      select: { filename: true },
    });

    await this.fileManager.deleteFile(fileId, reviewerId);

    if (file) {
      const reviewer = await this.prisma.user.findUnique({ where: { id: reviewerId }, select: { name: true } });
      const studentId = review.submission.assignment.studentId;

      if (studentId) {
        this.kafka.emit(NotificationEvent.FILE_DELETED, {
          recipientIds: [studentId],
          actorName: reviewer?.name ?? 'Teacher',
          entityId: fileId,
          entityType: 'file',
          filename: file.filename,
          submissionTopic: review.submission.topic,
        } satisfies FilePayload);
      }
    }
  }

  listReviewFiles(reviewId: string) {
    return this.fileManager.listReviewFiles(reviewId);
  }

  private async ensureReviewerOwnsReview(reviewId: string, reviewerId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: {
        reviewerId: true,
        submissionId: true,
        submission: {
          select: {
            topic: true,
            assignment: { select: { studentId: true } },
          },
        },
      },
    });
    if (!review) throw new NotFoundException('Review not found');
    if (review.reviewerId !== reviewerId) throw new ForbiddenException('You can only manage files for your own review');
    return review;
  }
}
