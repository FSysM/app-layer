import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get('all')
  async getAllSubmissions() {
    return this.submissionsService.getAllSubmissions();
  }

  @Get()
  @UseGuards(new JwtAuthGuard({ optional: true }))
  async getSubmissions(@Req() req) {
    return this.submissionsService.getSubmissions(req.user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createSubmission(@Body() data: any, @Req() req) {
    return this.submissionsService.createSubmission(data, req.user.userId);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateSubmission(@Body() data: any, @Req() req) {
    return this.submissionsService.updateSubmission(data, req.user.userId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteSubmission(@Body() data: any, @Req() req) {
    return this.submissionsService.deleteSubmission(data, req.user.userId);
  }

  @Post('approve')
  @UseGuards(JwtAuthGuard)
  async approveSubmission(@Body() data: any, @Req() req) {
    return this.submissionsService.approveSubmission(data.id, req.user.userId);
  }

  @Post('reject')
  @UseGuards(JwtAuthGuard)
  async rejectSubmission(@Body() data: any, @Req() req) {
    return this.submissionsService.rejectSubmission(data.id, req.user.userId);
  }
}
