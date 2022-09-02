import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AtGuard, RtGuard } from './common/guards';
import { CurrentUser } from './decorators/currentUser.decorator';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.register(dto)
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.login(dto)
  }

  @Post('/logout')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser('sub') userId: string) {
    return this.authService.logout(userId)
  }

  @Post('/refresh')
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@CurrentUser('sub') userId: string, @CurrentUser('refreshToken') rt: string) {
    return this.authService.refresh(userId, rt)
    
  }
}
