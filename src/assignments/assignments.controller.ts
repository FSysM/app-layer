import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Req,
  UseGuards,
  Delete,
  Query,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get('all')
  async getAllAssignments() {
    return this.assignmentsService.getAllAssignments();
  }

  @Get()
  @UseGuards(new JwtAuthGuard({ optional: true }))
  async getAssignments(@Req() req, @Query('filter') filter?: string) {
    return this.assignmentsService.getAssignments(req.user, filter);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createAssignment(@Body() data: any, @Req() req) {
    return this.assignmentsService.createAssignment(data, req.user.userId);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateAssignment(@Body() data: any, @Req() req) {
    return this.assignmentsService.updateAssignment(data, req.user.userId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteAssignment(@Body() data: any) {
    return this.assignmentsService.deleteAssignment(data);
  }

  @Post(':id/pick')
  @UseGuards(JwtAuthGuard)
  async pickAssignment(@Req() req) {
    return this.assignmentsService.pickAssignment(
      req.params.id,
      req.user.userId,
    );
  }

  @Post(':id/unpick')
  @UseGuards(JwtAuthGuard)
  async unpickAssignment(@Req() req) {
    return this.assignmentsService.unpickAssignment(req.params.id, req.user.userId);
  }
}
