import { Controller, Get } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}
  @Get()
  async getSubmissions() {
    return this.submissionsService.getSubmissions();
  }
}
