import { Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewFileUploadUrlDto } from './dto/file-upload-url.dto';
import { ReviewFileConfirmDto } from './dto/file-confirm.dto';
import { AuthenticatedRequest } from '../common/types/request.types';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('submission/:submissionId')
  getSubmissionReviews(@Param('submissionId') submissionId: string) {
    return this.reviewsService.getReviewsBySubmission(submissionId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('TEACHER')
  createReview(@Body() dto: CreateReviewDto, @Req() req: AuthenticatedRequest) {
    return this.reviewsService.createReview({
      submissionId: dto.submissionId,
      reviewerId: req.user.userId,
      grade: dto.grade as any,
      comment: dto.comment,
      type: dto.type as any,
    });
  }

  @Put()
  @UseGuards(RolesGuard)
  @Roles('TEACHER')
  updateReview(@Body() dto: UpdateReviewDto, @Req() req: AuthenticatedRequest) {
    return this.reviewsService.updateReview(dto.id, req.user.userId, {
      grade: dto.grade as any,
      comment: dto.comment,
    });
  }

  @Delete()
  @UseGuards(RolesGuard)
  @Roles('TEACHER')
  deleteReview(@Body() dto: UpdateReviewDto, @Req() req: AuthenticatedRequest) {
    return this.reviewsService.deleteReview(dto.id, req.user.userId);
  }

  // ── File management ──────────────────────────────────────────────────────────

  @Get(':id/files')
  listFiles(@Param('id') id: string) {
    return this.reviewsService.listReviewFiles(id);
  }

  @Post(':id/files/upload-url')
  @UseGuards(RolesGuard)
  @Roles('TEACHER')
  getFileUploadUrl(
    @Param('id') id: string,
    @Body() dto: ReviewFileUploadUrlDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.reviewsService.getFileUploadUrl(id, dto, req.user.userId);
  }

  @Post(':id/files/confirm')
  @UseGuards(RolesGuard)
  @Roles('TEACHER')
  confirmFileUpload(
    @Param('id') id: string,
    @Body() dto: ReviewFileConfirmDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.reviewsService.confirmFileUpload(id, dto, req.user.userId);
  }

  @Delete(':id/files/:fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles('TEACHER')
  deleteFile(
    @Param('id') id: string,
    @Param('fileId') fileId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.reviewsService.deleteReviewFile(id, fileId, req.user.userId);
  }
}
