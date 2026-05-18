import { Controller, Get, Post, Delete, Body, Req, UseGuards, Put } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { ApproveSubmissionDto } from './dto/approve-submission.dto';
import { AuthenticatedRequest } from '../common/types/request.types';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get('all')
  getAllSubmissions() {
    return this.submissionsService.getAllSubmissions();
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  getSubmissions(@Req() req: AuthenticatedRequest) {
    return this.submissionsService.getSubmissions(req.user);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  createSubmission(@Body() dto: CreateSubmissionDto) {
    return this.submissionsService.createSubmission(dto);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  updateSubmission(@Body() dto: UpdateSubmissionDto, @Req() req: AuthenticatedRequest) {
    return this.submissionsService.updateSubmission(dto, req.user.userId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  deleteSubmission(@Body() dto: UpdateSubmissionDto, @Req() req: AuthenticatedRequest) {
    return this.submissionsService.deleteSubmission(dto.id, req.user.userId);
  }

  @Post('approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER')
  approveSubmission(@Body() dto: ApproveSubmissionDto) {
    return this.submissionsService.approveSubmission(dto.id, dto.opponentId);
  }

  @Post('reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER')
  rejectSubmission(@Body() dto: UpdateSubmissionDto) {
    return this.submissionsService.rejectSubmission(dto.id);
  }
}
