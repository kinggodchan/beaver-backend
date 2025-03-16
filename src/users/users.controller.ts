import { Body, Controller, Get, HttpStatus, Logger, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequestDto  } from './dto/create-user-request.dto';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';

@Controller('api/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() createUserRequestDto: CreateUserRequestDto): Promise<void> {
    return this.userService.createUser(createUserRequestDto);
  }

  @Get()// 사용자 목록을 조회하는 핸들러 추가
  async getUsers(): Promise<CreateUserRequestDto[]> {
    return this.userService.findAll(); // 모든 사용자 정보를 반환하는 서비스 호출
  }
    //조회, 수정, 삭제(접근 권한이 필요하다. ==> ADMIN, 또는 본인)
}
