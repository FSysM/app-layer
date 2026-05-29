import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/types/request.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  me(@Req() req: AuthenticatedRequest) {
    return this.authService.getMe(req.user.userId);
  }
}
