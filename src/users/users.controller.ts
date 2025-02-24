import { Body, Controller, HttpStatus, Logger, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequestDto  } from './dto/create-user-request.dto';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';

@Controller('api/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  
  constructor(private readonly userService: UsersService) {}


    //조회, 수정, 삭제(접근 권한이 필요하다. ==> ADMIN, 또는 본인)
}
