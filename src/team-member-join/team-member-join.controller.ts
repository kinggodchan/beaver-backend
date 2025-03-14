import { Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { TeamMemberJoinService } from './team-member-join.service';
import { Roles } from 'src/auth/custom-guards-decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user-role.enum';
import { GetUser } from 'src/auth/custom-guards-decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-guards-decorators/custom-role.guard';

@Controller('api/teams')
@UseGuards(AuthGuard(), RolesGuard)
export class TeamMemberJoinController {
  constructor(private readonly teamMemberJoinService: TeamMemberJoinService) {}

  // 사용자가 팀 가입을 신청
  @Post(':teamId/join')
  @Roles(UserRole.USER)
  async requestJoinTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
    @GetUser() logginedUser : User // 현재 로그인한 사용자
  ) {
    return this.teamMemberJoinService.requestJoinTeam(teamId, logginedUser.user_id);
  }
}
