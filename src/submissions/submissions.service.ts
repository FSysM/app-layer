import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const BASE_SELECT = {
  id: true,
  status: true,
  literature: true,
  fileUrl: true,
  submissionDate: true,

  assignment: {
    select: {
      id: true,
      topic: true,
      type: true,
      faculty: true,
      department: true,
      annotation: true,
      assignmentDate: true,

      student: {
        select: {
          id: true,
          name: true,
        },
      },

      supervisor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },

  opponent: {
    select: {
      id: true,
      name: true,
    },
  },

  review: true,
} as const;

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async getAllSubmissions() {
    return this.prisma.submission.findMany({
      select: BASE_SELECT,
    });
  }

  async getSubmissions(user?: { userId: string; role: string }) {
    if (!user) {
      return this.prisma.submission.findMany({
        select: BASE_SELECT,
      });
    }

    if (user.role === 'STUDENT') {
      return this.prisma.submission.findMany({
        where: {
          assignment: {
            studentId: user.userId,
          },
        },
        select: BASE_SELECT,
      });
    }

    if (user.role === 'TEACHER') {
      return this.prisma.submission.findMany({
        where: {
          assignment: {
            supervisorId: user.userId,
          },
        },
        select: BASE_SELECT,
      });
    }

    return this.prisma.submission.findMany({
      where: {
        opponentId: user.userId,
      },
      select: BASE_SELECT,
    });
  }

  createSubmission(data: any, studentId: string) {
    return this.prisma.submission.create({
      data: {
        assignmentId: data.assignmentId,
        opponentId: studentId,
        status: 'PENDING',
        literature: data.literature,
        fileUrl: data.fileUrl,
      },
    });
  }
}
