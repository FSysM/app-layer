import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type UpdateMeData = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
};

const PROFILE_SELECT = {
  id: true,
  username: true,
  email: true,
  role: true,
  name: true,
  phone: true,
  address: true,
  profilePicture: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: PROFILE_SELECT,
    });
  }

  updateMe(id: string, data: UpdateMeData) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: PROFILE_SELECT,
    });
  }

  getTeachers() {
    return this.prisma.user.findMany({
      where: { role: 'TEACHER' },
      select: { id: true, name: true },
    });
  }
}
