import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
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

  @Patch('me')
  updateMe(@Req() req: any, @Body() body: any) {
    return this.usersService.updateMe(req.user.userId, body);
  }

  @Get('teachers')
  getTeachers() {
    return this.usersService.getTeachers();
  }
}
