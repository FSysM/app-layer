import { Controller, Get, Post, Put, Body, Req, UseGuards, Delete, Query, Param } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AuthenticatedRequest } from '../common/types/request.types';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get('all')
  getAllAssignments() {
    return this.assignmentsService.getAllAssignments();
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  getAssignments(@Req() req: AuthenticatedRequest, @Query('filter') filter?: string) {
    return this.assignmentsService.getAssignments(req.user, filter);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER')
  createAssignment(@Body() dto: CreateAssignmentDto, @Req() req: AuthenticatedRequest) {
    return this.assignmentsService.createAssignment(dto, req.user.userId);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER')
  updateAssignment(@Body() dto: UpdateAssignmentDto, @Req() req: AuthenticatedRequest) {
    return this.assignmentsService.updateAssignment(dto, req.user.userId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER')
  deleteAssignment(@Body() dto: UpdateAssignmentDto, @Req() req: AuthenticatedRequest) {
    return this.assignmentsService.deleteAssignment(dto.id, req.user.userId);
  }

  @Post(':id/pick')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  pickAssignment(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.assignmentsService.pickAssignment(id, req.user.userId);
  }

  @Post(':id/unpick')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  unpickAssignment(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.assignmentsService.unpickAssignment(id, req.user.userId);
  }
}
