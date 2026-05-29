import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
        profilePicture: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
