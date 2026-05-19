import { Controller, Get, Post, Delete, Body, Req, UseGuards, Put, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { ApproveSubmissionDto } from './dto/approve-submission.dto';
import { FileUploadUrlDto } from './dto/file-upload-url.dto';
import { FileConfirmDto } from './dto/file-confirm.dto';
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

  // ── File management ──────────────────────────────────────────────────────────

  @Get(':id/files')
  @UseGuards(JwtAuthGuard)
  listFiles(@Param('id') id: string) {
    return this.submissionsService.listSubmissionFiles(id);
  }

  @Post(':id/files/upload-url')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  getFileUploadUrl(
    @Param('id') id: string,
    @Body() dto: FileUploadUrlDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.submissionsService.getFileUploadUrl(id, dto, req.user.userId);
  }

  @Post(':id/files/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  confirmFileUpload(
    @Param('id') id: string,
    @Body() dto: FileConfirmDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.submissionsService.confirmFileUpload(id, dto, req.user.userId);
  }

  @Delete(':id/files/:fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  deleteFile(
    @Param('id') id: string,
    @Param('fileId') fileId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.submissionsService.deleteSubmissionFile(id, fileId, req.user.userId);
  }
}
