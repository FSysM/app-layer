import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

const BASE_SELECT = {
  id: true,
  topic: true,
  type: true,
  faculty: true,
  department: true,
  annotation: true,
  assignmentDate: true,
  taken: true,
  student: { select: { id: true, name: true } },
  supervisor: { select: { id: true, name: true } },
} as const;

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  getAllAssignments() {
    return this.prisma.assignment.findMany({ select: BASE_SELECT });
  }

  getAssignments(user?: { userId: string; role: string }, filter?: string) {
    if (user?.role === 'TEACHER' && filter === 'my') {
      return this.prisma.assignment.findMany({
        where: { supervisorId: user.userId },
        select: BASE_SELECT,
      });
    }

    if (user?.role === 'STUDENT' && filter === 'my') {
      return this.prisma.assignment.findMany({
        where: { studentId: user.userId },
        select: BASE_SELECT,
      });
    }

    return this.prisma.assignment.findMany({ select: BASE_SELECT });
  }

  createAssignment(dto: CreateAssignmentDto, supervisorId: string) {
    return this.prisma.assignment.create({
      data: {
        topic: dto.topic,
        type: dto.type as any,
        faculty: dto.faculty as any,
        department: dto.department as any,
        annotation: dto.annotation,
        supervisorId,
      },
    });
  }

  updateAssignment(dto: UpdateAssignmentDto, supervisorId: string) {
    return this.prisma.assignment.update({
      where: { id: dto.id },
      data: {
        topic: dto.topic,
        type: dto.type as any,
        faculty: dto.faculty as any,
        department: dto.department as any,
        annotation: dto.annotation,
        supervisorId,
      },
    });
  }

  async deleteAssignment(id: string, supervisorId: string) {
    const assignment = await this.prisma.assignment.findUnique({ where: { id } });
    if (!assignment) throw new NotFoundException('Assignment not found');
    if (assignment.supervisorId !== supervisorId) throw new ForbiddenException('You can only delete your own assignments');
    return this.prisma.assignment.delete({ where: { id } });
  }

  async pickAssignment(id: string, studentId: string) {
    const assignment = await this.prisma.assignment.findUnique({ where: { id } });
    if (!assignment) throw new Error('Assignment not found');
    if (assignment.taken) throw new Error('Assignment already taken');
    return this.prisma.assignment.update({
      where: { id },
      data: { taken: true, studentId },
    });
  }

  async unpickAssignment(id: string, userId: string) {
    const assignment = await this.prisma.assignment.findUnique({ where: { id } });
    if (!assignment) throw new Error('Assignment not found');
    if (!assignment.taken) throw new Error('Assignment is not taken');
    if (assignment.studentId !== userId) throw new ForbiddenException('You can only unpick your own assignment');
    return this.prisma.assignment.update({
      where: { id },
      data: { taken: false, studentId: null },
    });
  }
}
