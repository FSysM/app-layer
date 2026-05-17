import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, email: true, role: true, name: true },
    });
  }

  getTeachers() {
    return this.prisma.user.findMany({
      where: { role: 'TEACHER' },
      select: { id: true, name: true },
    });
  }
}
