import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
} from '@nestjs/common';

import { LoginDto, RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
 
  @Get('checkuser')
  @UsePipes(new ValidationPipe())
  getProductsUser(@Query('token') token: string) {
    return this.authService.checkUser(token);
  }
}
