import { Injectable } from '@nestjs/common';
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
  student: { select: { name: true } },
  supervisor: { select: { name: true } },
} as const;

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  getAllAssignments() {
    return this.prisma.assignment.findMany({ select: BASE_SELECT });
  }

  getAssignments(user?: { userId: string; role: string }) {
    if (user?.role === 'TEACHER') {
      return this.prisma.assignment.findMany({
        where: { supervisorId: user.userId },
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
        assignmentDate: data.assignmentDate,
        taken: data.taken,
        supervisorId,
      },
    });
  }

  deleteAssignment(data: any, supervisorId: string) {
    return this.prisma.assignment.delete({
      where: { id: data.id },
    });
  }
}
