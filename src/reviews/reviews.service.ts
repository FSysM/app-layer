import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
  constructor(private prisma: PrismaService) {}

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
      select: { status: true },
    });

    if (!submission || submission.status !== 'COMPLETED') {
      throw new BadRequestException('Submission must be approved before writing a review');
    }

    return this.prisma.review.create({
      data: data as any,
      select: REVIEW_SELECT,
    });
  }

  async updateReview(reviewId: string, userId: string, data: { grade: Grade; comment?: string }) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.reviewerId !== userId) throw new ForbiddenException('You can only edit your own reviews');
    return this.prisma.review.update({
      where: { id: reviewId },
      data,
      select: REVIEW_SELECT,
    });
  }

  async deleteReview(reviewId: string, userId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.reviewerId !== userId) throw new ForbiddenException('You can only delete your own reviews');
    return this.prisma.review.delete({
      where: { id: reviewId },
      select: REVIEW_SELECT,
    });
  }
}
