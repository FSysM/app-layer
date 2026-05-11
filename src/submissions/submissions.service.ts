import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async getSubmissions() {
    return this.prisma.submission.findMany({
      select: {
        id: true,
        status: true,
        literature: true,
        submissionDate: true,

        assignment: {
          select: {
            topic: true,
            type: true,
            faculty: true,
            department: true,
            annotation: true,

            student: {
              select: {
                name: true,
              },
            },
            supervisor: {
              select: {
                name: true,
              },
            },
          },
        },

        opponent: {
          select: {
            name: true,
          },
        },

        review: true,
      },
    });
  }
}
