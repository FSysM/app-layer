import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}
  async getAssignments() {
    return this.prisma.assignment.findMany();
  }
}
