import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
  constructor(private prisma: PrismaService) {}

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

  createSubmission(data: any) {
    return this.prisma.submission.create({
      data: {
        assignmentId: data.assignmentId,
        status: 'PENDING',
        topic: data.topic,
        type: data.type,
        faculty: data.faculty,
        department: data.department,
        annotation: data.annotation,
        literature: data.literature,
        fileUrl: data.fileUrl,
      } as any,
      select: BASE_SELECT,
    });
  }

  updateSubmission(data: any) {
    const { id, ...fields } = data;
    return this.prisma.submission.update({
      where: { id },
      data: {
        topic: fields.topic,
        type: fields.type,
        faculty: fields.faculty,
        department: fields.department,
        annotation: fields.annotation,
        literature: fields.literature,
        fileUrl: fields.fileUrl,
      } as any,
      select: BASE_SELECT,
    });
  }

  deleteSubmission(data: any) {
    return this.prisma.submission.delete({ where: { id: data.id } });
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
}
