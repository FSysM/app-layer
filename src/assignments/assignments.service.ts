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

  getAssignments(user?: { userId: string; role: string }) {
    if (user?.role === 'TEACHER') {
      return this.prisma.assignment.findMany({
        where: { supervisorId: user.userId },
        select: BASE_SELECT,
      });
    }

    return this.prisma.assignment.findMany({ select: BASE_SELECT });
  }
}
