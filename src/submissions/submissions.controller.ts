import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}
  @Get()
  @UseGuards(new JwtAuthGuard({ optional: true }))
  async getSubmissions(@Req() req) {
    return this.submissionsService.getSubmissions(req.user);
  }
}
