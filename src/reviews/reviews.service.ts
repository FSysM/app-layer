import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export const REVIEW_SELECT = {
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
            select: { name: true },
          },
          supervisor: {
            select: { name: true },
          },
        },
      },
    },
  },

  reviewer: {
    select: { name: true },
  },
} as const;

export const REVIEW_WRITE_SELECT = {
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
      where: {
        submissionId,
      },
      select: REVIEW_SELECT,
    });
  }

  async createReview(data: {
    submissionId: string;
    reviewerId: string;
    grade: Grade;
    comment: string;
  }) {
    return this.prisma.review.create({
      data,
      select: REVIEW_WRITE_SELECT,
    });
  }

  async updateReview(
    reviewId: string,
    data: { grade: Grade; comment?: string },
  ) {
    return this.prisma.review.update({
      where: { id: reviewId },
      data,
      select: REVIEW_WRITE_SELECT,
    });
  }

  async deleteReview(reviewId: string) {
    return this.prisma.review.delete({
      where: {
        id: reviewId,
      },
      select: REVIEW_WRITE_SELECT,
    });
  }
}
