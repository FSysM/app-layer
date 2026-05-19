import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FileManagerService, FileFolder } from '../filemanager/filemanager.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
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

  createSubmission(dto: CreateSubmissionDto) {
    return this.prisma.submission.create({
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
  }

  async updateSubmission(dto: UpdateSubmissionDto, studentId: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: dto.id },
      select: { assignment: { select: { studentId: true } } },
    });
    if (!submission) throw new NotFoundException('Submission not found');
    if (submission.assignment.studentId !== studentId) throw new ForbiddenException('You can only edit your own submission');
    return this.prisma.submission.update({
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
  }

  async deleteSubmission(id: string, studentId: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      select: { assignment: { select: { studentId: true } } },
    });
    if (!submission) throw new NotFoundException('Submission not found');
    if (submission.assignment.studentId !== studentId) throw new ForbiddenException('You can only delete your own submission');
    return this.prisma.submission.delete({ where: { id } });
  }

  approveSubmission(id: string, opponentId: string) {
    return this.prisma.submission.update({
      where: { id },
      data: { status: 'COMPLETED', opponentId },
      select: BASE_SELECT,
    });
  }

  rejectSubmission(id: string) {
    return this.prisma.submission.update({
      where: { id },
      data: { status: 'REJECTED' },
      select: BASE_SELECT,
    });
  }

  // ── File management ──────────────────────────────────────────────────────────

  async getFileUploadUrl(submissionId: string, dto: FileUploadUrlDto, studentId: string) {
    await this.ensureStudentOwnsSubmission(submissionId, studentId);
    return this.fileManager.getUploadUrl(submissionId, dto.folder as FileFolder, dto.filename, dto.contentType);
  }

  async confirmFileUpload(submissionId: string, dto: FileConfirmDto, studentId: string) {
    await this.ensureStudentOwnsSubmission(submissionId, studentId);
    return this.fileManager.confirmUpload({
      key: dto.key,
      filename: dto.filename,
      contentType: dto.contentType,
      folder: dto.folder as FileFolder,
      submissionId,
      uploadedById: studentId,
      size: dto.size,
    });
  }

  async deleteSubmissionFile(submissionId: string, fileId: string, studentId: string) {
    await this.ensureStudentOwnsSubmission(submissionId, studentId);
    return this.fileManager.deleteFile(fileId, studentId);
  }

  listSubmissionFiles(submissionId: string) {
    return this.fileManager.listSubmissionFiles(submissionId);
  }

  private async ensureStudentOwnsSubmission(submissionId: string, studentId: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      select: { assignment: { select: { studentId: true } } },
    });
    if (!submission) throw new NotFoundException('Submission not found');
    if (submission.assignment.studentId !== studentId) throw new ForbiddenException('You can only manage files for your own submission');
  }
}
