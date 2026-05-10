import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

const COOKIE_OPTIONS = {
  httpOnly: false,
  secure: false,
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(dto);

    res.cookie('refreshToken', refreshToken, {
      ...COOKIE_OPTIONS,
      httpOnly: true,
    });
    res.cookie('rt-present', '1', COOKIE_OPTIONS);

    return { accessToken, user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Req() req: any) {
    return this.authService.refresh(req.cookies?.refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: any) {
    res.clearCookie('refreshToken');
    res.clearCookie('rt-present');
    return { success: true };
  }
}
