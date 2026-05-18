import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

  createAssignment(data: any, supervisorId: string) {
    return this.prisma.assignment.create({
      data: {
        topic: data.topic,
        type: data.type,
        faculty: data.faculty,
        department: data.department,
        annotation: data.annotation,
        supervisorId,
      },
    });
  }

  updateAssignment(data: any, supervisorId: string) {
    return this.prisma.assignment.update({
      where: { id: data.id },
      data: {
        topic: data.topic,
        type: data.type,
        faculty: data.faculty,
        department: data.department,
        annotation: data.annotation,
        supervisorId,
      },
    });
  }

  deleteAssignment(data: any) {
    return this.prisma.assignment.delete({ where: { id: data.id } });
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
