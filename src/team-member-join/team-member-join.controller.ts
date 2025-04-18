import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TeamMemberJoinService } from './team-member-join.service';
import { Roles } from 'src/auth/custom-guards-decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user-role.enum';
import { GetUser } from 'src/auth/custom-guards-decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-guards-decorators/custom-role.guard';
import { JoinStatus } from './entities/join-status.enum';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';
import { TeamMemberJoin } from './entities/team-member-join.entity';

@Controller('api/teams')
@UseGuards(AuthGuard(), RolesGuard)
export class TeamMemberJoinController {
  constructor(private readonly teamMemberJoinService: TeamMemberJoinService) {}

  // 참가 신청
  @Post(':teamId/join')
  @Roles(UserRole.USER)
  async requestJoinTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
    @GetUser() logginedUser: User, // 현재 로그인한 사용자
  ): Promise<ApiResponseDto<void>> {
    await this.teamMemberJoinService.requestJoinTeam(
      teamId,
      logginedUser.user_id,
    );
    return new ApiResponseDto(true, HttpStatus.OK, 'Team updated successfully');
  }

  // 팀장이 참가 신청을 승인/ 거절
  @Patch(':teamId/join/:joinId/status')
  async updateJoinStatus(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('joinId', ParseIntPipe) joinId: number,
    @Body('status', new ParseEnumPipe(JoinStatus)) status: JoinStatus,
    @GetUser() logginedUser: User,
  ): Promise<ApiResponseDto<void>> {
    await this.teamMemberJoinService.updateJoinStatus(
      teamId,
      joinId,
      logginedUser.user_id,
      status,
    );
    return new ApiResponseDto(true, HttpStatus.OK, 'Team updated successfully');
  }

  // 팀장이 자기 팀의 참가 신청 목록을 조회
  @Get(':teamId/join/all')
  @Roles(UserRole.USER)
  async getAllJoins(
    @Param('teamId', ParseIntPipe) teamId: number,
    @GetUser() user: User,
  ): Promise<ApiResponseDto<TeamMemberJoin[]>> {
    const all = await this.teamMemberJoinService.getAllJoins(
      teamId,
      user,
    );
    return new ApiResponseDto(true, HttpStatus.OK, 'Join list retrieved', all);
  }
}
