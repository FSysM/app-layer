import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaService } from '../kafka/kafka.service';
import { NotificationEvent } from '../kafka/notification.events';
import type {
  SubmissionPayload,
  FilePayload,
} from '../kafka/notification.events';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { FileManagerService, FileFolder } from '../filemanager/filemanager.service';
import { FileUploadUrlDto } from './dto/file-upload-url.dto';
import { FileConfirmDto } from './dto/file-confirm.dto';

const BASE_SELECT = {
  id: true,
  topic: true,
  type: true,
  faculty: true,
  department: true,
  annotation: true,
  status: true,
  literature: true,
  fileUrl: true,
  submissionDate: true,

  assignment: {
    select: {
      id: true,
      assignmentDate: true,
      student: { select: { id: true, name: true } },
      supervisor: { select: { id: true, name: true } },
    },
  },

  opponent: {
    select: { id: true, name: true },
  },

  reviews: {
    select: { id: true, grade: true, comment: true, type: true },
  },
} as const;

@Injectable()
export class SubmissionsService {
  constructor(
    private prisma: PrismaService,
    private fileManager: FileManagerService,
    private kafka: KafkaService,
  ) {}

  getAllSubmissions() {
    return this.prisma.submission.findMany({ select: BASE_SELECT });
  }

  getSubmissions(user?: { userId: string; role: string }) {
    if (user?.role === 'STUDENT') {
      return this.prisma.submission.findMany({
        where: { assignment: { studentId: user.userId } },
        select: BASE_SELECT,
      });
    }

    if (user?.role === 'TEACHER') {
      return this.prisma.submission.findMany({
        where: {
          OR: [
            { assignment: { supervisorId: user.userId } },
            { opponentId: user.userId },
          ],
        },
        select: BASE_SELECT,
      });
    }

    return this.prisma.submission.findMany({ select: BASE_SELECT });
  }

  async createSubmission(dto: CreateSubmissionDto) {
    const result = await this.prisma.submission.create({
      data: {
        assignmentId: dto.assignmentId,
        status: 'PENDING',
        topic: dto.topic,
        type: dto.type as any,
        faculty: dto.faculty as any,
        department: dto.department as any,
        annotation: dto.annotation,
        literature: dto.literature,
        fileUrl: dto.fileUrl,
      },
      select: BASE_SELECT,
    });

    this.kafka.emit(NotificationEvent.SUBMISSION_SUBMITTED, {
      recipientIds: [result.assignment.supervisor.id],
      actorName: result.assignment.student?.name ?? 'Student',
      entityId: result.id,
      entityType: 'submission',
      submissionTopic: result.topic,
    } satisfies SubmissionPayload);

    return result;
  }

  async updateSubmission(dto: UpdateSubmissionDto, studentId: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: dto.id },
      select: { assignment: { select: { studentId: true } } },
    });
    if (!submission) throw new NotFoundException('Submission not found');
    if (submission.assignment.studentId !== studentId)
      throw new ForbiddenException('You can only edit your own submission');

    const result = await this.prisma.submission.update({
      where: { id: dto.id },
      data: {
        topic: dto.topic,
        type: dto.type as any,
        faculty: dto.faculty as any,
        department: dto.department as any,
        annotation: dto.annotation,
        literature: dto.literature,
        fileUrl: dto.fileUrl,
      },
      select: BASE_SELECT,
    });

    this.kafka.emit(NotificationEvent.SUBMISSION_EDITED, {
      recipientIds: [result.assignment.supervisor.id],
      actorName: result.assignment.student?.name ?? 'Student',
      entityId: result.id,
      entityType: 'submission',
      submissionTopic: result.topic,
    } satisfies SubmissionPayload);

    return result;
  }

  async deleteSubmission(id: string, studentId: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      select: {
        topic: true,
        assignment: {
          select: {
            studentId: true,
            supervisorId: true,
            student: { select: { name: true } },
          },
        },
      },
    });
    if (!submission) throw new NotFoundException('Submission not found');
    if (submission.assignment.studentId !== studentId)
      throw new ForbiddenException('You can only delete your own submission');

    const result = await this.prisma.submission.delete({ where: { id } });

    this.kafka.emit(NotificationEvent.SUBMISSION_DELETED, {
      recipientIds: [submission.assignment.supervisorId],
      actorName: submission.assignment.student?.name ?? 'Student',
      entityId: id,
      entityType: 'submission',
      submissionTopic: submission.topic,
    } satisfies SubmissionPayload);

    return result;
  }

  async approveSubmission(
    id: string,
    opponentId: string,
    supervisorId: string,
  ) {
    const result = await this.prisma.submission.update({
      where: { id },
      data: { status: 'COMPLETED', opponentId },
      select: BASE_SELECT,
    });

    const supervisor = await this.prisma.user.findUnique({
      where: { id: supervisorId },
      select: { name: true },
    });
    const supervisorName = supervisor?.name ?? 'Supervisor';
    const studentId = result.assignment.student?.id;

    if (studentId) {
      this.kafka.emit(NotificationEvent.SUBMISSION_APPROVED, {
        recipientIds: [studentId],
        actorName: supervisorName,
        entityId: id,
        entityType: 'submission',
        submissionTopic: result.topic,
      } satisfies SubmissionPayload);
    }

    this.kafka.emit(NotificationEvent.SUBMISSION_OPPONENT_ASSIGNED, {
      recipientIds: [opponentId],
      actorName: supervisorName,
      entityId: id,
      entityType: 'submission',
      submissionTopic: result.topic,
    } satisfies SubmissionPayload);

    return result;
  }

  async rejectSubmission(id: string, supervisorId: string) {
    const result = await this.prisma.submission.update({
      where: { id },
      data: { status: 'REJECTED' },
      select: BASE_SELECT,
    });

    const supervisor = await this.prisma.user.findUnique({
      where: { id: supervisorId },
      select: { name: true },
    });
    const studentId = result.assignment.student?.id;

    if (studentId) {
      this.kafka.emit(NotificationEvent.SUBMISSION_REJECTED, {
        recipientIds: [studentId],
        actorName: supervisor?.name ?? 'Supervisor',
        entityId: id,
        entityType: 'submission',
        submissionTopic: result.topic,
      } satisfies SubmissionPayload);
    }

    return result;
  }

  // ── File management ────────────────────────────────────────────────────────

  async getFileUploadUrl(
    submissionId: string,
    dto: FileUploadUrlDto,
    studentId: string,
  ) {
    await this.ensureStudentOwnsSubmission(submissionId, studentId);
    return this.fileManager.getUploadUrl(
      submissionId,
      dto.folder as FileFolder,
      dto.filename,
      dto.contentType,
    );
  }

  async confirmFileUpload(
    submissionId: string,
    dto: FileConfirmDto,
    studentId: string,
  ) {
    const { supervisorId, topic } = await this.ensureStudentOwnsSubmission(
      submissionId,
      studentId,
    );
    const file = await this.fileManager.confirmUpload({
      key: dto.key,
      filename: dto.filename,
      contentType: dto.contentType,
      folder: dto.folder as FileFolder,
      submissionId,
      uploadedById: studentId,
      size: dto.size,
    });

    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
      select: { name: true },
    });
    const event =
      dto.folder === 'TEXT'
        ? NotificationEvent.FILE_MAIN_UPLOADED
        : NotificationEvent.FILE_ATTACHMENT_UPLOADED;

    this.kafka.emit(event, {
      recipientIds: [supervisorId],
      actorName: student?.name ?? 'Student',
      entityId: file.id,
      entityType: 'file',
      filename: dto.filename,
      submissionTopic: topic,
    } satisfies FilePayload);

    return file;
  }

  async deleteSubmissionFile(
    submissionId: string,
    fileId: string,
    studentId: string,
  ) {
    const { supervisorId, topic } = await this.ensureStudentOwnsSubmission(
      submissionId,
      studentId,
    );
    const file = await this.fileManager.deleteFile(fileId, studentId);

    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
      select: { name: true },
    });
    const event =
      file.folder === 'TEXT'
        ? NotificationEvent.FILE_MAIN_DELETED
        : NotificationEvent.FILE_ATTACHMENT_DELETED;

    this.kafka.emit(event, {
      recipientIds: [supervisorId],
      actorName: student?.name ?? 'Student',
      entityId: fileId,
      entityType: 'file',
      filename: file.filename,
      submissionTopic: topic,
    } satisfies FilePayload);
  }

  listSubmissionFiles(submissionId: string) {
    return this.fileManager.listSubmissionFiles(submissionId);
  }

  private async ensureStudentOwnsSubmission(
    submissionId: string,
    studentId: string,
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      select: {
        topic: true,
        assignment: { select: { studentId: true, supervisorId: true } },
      },
    });
    if (!submission) throw new NotFoundException('Submission not found');
    if (submission.assignment.studentId !== studentId)
      throw new ForbiddenException(
        'You can only manage files for your own submission',
      );
    return {
      supervisorId: submission.assignment.supervisorId,
      topic: submission.topic,
    };
  }
}
