import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}
  async getReviews() {
    return this.prisma.review.findMany({
      select: {
        id: true,
        grade: true,
        comment: true,

        type: true,

        submission: {
          select: {
            assignment: {
              select: {
                topic: true,

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
          },
        },

        reviewer: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
