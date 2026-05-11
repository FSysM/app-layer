import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}
  @Get()
  @UseGuards(new JwtAuthGuard({ optional: true }))
  async getAssignments(@Req() req) {
    return this.assignmentsService.getAssignments(req.user);
  }
}
