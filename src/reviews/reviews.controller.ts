import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('submission/:submissionId')
  getSubmissionReviews(@Param('submissionId') submissionId: string) {
    return this.reviewsService.getReviewsBySubmission(submissionId);
  }

  @Post()
  createReview(@Body() body: any, @Req() req: any) {
    return this.reviewsService.createReview({
      submissionId: body.submissionId,
      reviewerId: req.user.userId,
      grade: body.grade,
      comment: body.comment,
      type: body.type,
    });
  }

  @Put()
  updateReview(@Body() body: any) {
    return this.reviewsService.updateReview(body.id, {
      grade: body.grade,
      comment: body.comment,
    });
  }

  @Delete()
  deleteReview(@Body() body: any) {
    return this.reviewsService.deleteReview(body.id);
  }
}
