import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.guard';
import { GetUser } from 'src/auth/custom-guards-decorators/get-user.decorator';

@Controller('api/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UsersService) {}

  @Post('/')
  async createUser(
    @Body() createUserRequestDto: CreateUserRequestDto,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    const user: User = await this.userService.createUser(createUserRequestDto);
    return new ApiResponseDto(
      true,
      HttpStatus.OK,
      'User retrieved',
      new UserResponseDto(user),
    );
  }

  @Get('/') // 사용자 목록을 조회하는 핸들러 추가
  async getUsers(): Promise<ApiResponseDto<UserResponseDto[]>> {
    const users: User[] = await this.userService.findAll(); // 모든 사용자 정보를 반환하는 서비스 호출
    const usersResponseDto = users.map((user) => new UserResponseDto(user));

    return new ApiResponseDto(
      true,
      HttpStatus.OK,
      'User List',
      usersResponseDto,
    );
  }

  //이 엔드포인트는 로그인된 사용자만 접근 가능하며, req.user에서 유저 정보를 꺼냄
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@GetUser() user: User): Promise<ApiResponseDto<UserResponseDto>> {
    return new ApiResponseDto(
      true,
      HttpStatus.OK,
      'User retrieved',
      new UserResponseDto(user),
    );
  }

  //조회, 수정, 삭제(접근 권한이 필요하다. ==> ADMIN, 또는 본인)
}
