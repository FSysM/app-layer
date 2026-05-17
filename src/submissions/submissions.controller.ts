import { Controller, Get, Post, Delete, Body, Req, UseGuards, Put } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get('all')
  getAllSubmissions() {
    return this.submissionsService.getAllSubmissions();
  }

  @Get()
  @UseGuards(new JwtAuthGuard({ optional: true }))
  getSubmissions(@Req() req) {
    return this.submissionsService.getSubmissions(req.user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createSubmission(@Body() data: any) {
    return this.submissionsService.createSubmission(data);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateSubmission(@Body() data: any) {
    return this.submissionsService.updateSubmission(data);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteSubmission(@Body() data: any) {
    return this.submissionsService.deleteSubmission(data);
  }

  @Post('approve')
  @UseGuards(JwtAuthGuard)
  approveSubmission(@Body() data: any) {
    return this.submissionsService.approveSubmission(data.id, data.opponentId);
  }

  @Post('reject')
  @UseGuards(JwtAuthGuard)
  rejectSubmission(@Body() data: any) {
    return this.submissionsService.rejectSubmission(data.id);
  }
}
