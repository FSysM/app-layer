import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@Req() req: any) {
    return this.usersService.getUserById(req.user.userId);
  }

  @Get('teachers')
  getTeachers() {
    return this.usersService.getTeachers();
  }
}
