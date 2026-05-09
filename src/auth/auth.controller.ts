import {
  Body,
  Controller,
  Post
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'

@Controller('login')
export class LoginController {
    constructor(private readonly loginService: AuthService ) {}
    @Post()
    async login(@Body() dto: LoginDto) {
        return this.loginService.login(dto);
    }
}
