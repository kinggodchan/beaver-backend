import { Body, Controller, Get, HttpStatus, Logger, Post, Res, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';
import { CreateUserRequestDto } from 'src/users/dto/create-user-request.dto';
import { JwtAuthGuard } from './strategies/jwt.guard';

@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  // 회원가입
  @Post('/signup')
  async signUp(@Body() createUserRequestDto: CreateUserRequestDto): Promise<ApiResponseDto<void>> {
    this.logger.verbose(`Visitor is try to creating a new account with title: ${createUserRequestDto.email}`);
    await this.authService.signUp(createUserRequestDto);
    this.logger.verbose(`New account created Successfully`);
    return new ApiResponseDto(true, HttpStatus.CREATED, 'User created Successfully');
  }

  // 로그인
// 로그인
@Post('/signin')
async signIn(@Body() signInRequestDto: SignInRequestDto, @Res() res: Response): Promise<void> {
  this.logger.verbose(`User with email: ${signInRequestDto.email} is try to signing in`);

  const { accessToken, user } = await this.authService.signIn(signInRequestDto);
  this.logger.verbose(`User with email: ${signInRequestDto.email} issued JWT ${accessToken}`);

  res.setHeader('Authorization', accessToken);
  const response = new ApiResponseDto(true, HttpStatus.OK, 'User logged in successfully', { accessToken, user });
  res.send(response);
}


  // 👉 current-user 확인용 API (여기 추가!)
  @UseGuards(JwtAuthGuard)
  @Get('/current-user')
  getCurrentUser(@Request() req) {
    return req.user;
  }
}
