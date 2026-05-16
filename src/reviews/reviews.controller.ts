import { Controller, Get, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('submission/:submissionId')
  async getSubmissionReviews(@Param('submissionId') submissionId: string) {
    return this.reviewsService.getReviewsBySubmission(submissionId);
  }
}
