import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  ParseEnumPipe,
} from '@nestjs/common';
import { MatchJoinService } from './match-join.service';
import { CreateMatchJoinDto } from './dto/create-match-join.dto';
import { UpdateMatchJoinDto } from './dto/update-match-join.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-guards-decorators/custom-role.guard';
import { Roles } from 'src/auth/custom-guards-decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user-role.enum';
import { GetUser } from 'src/auth/custom-guards-decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';
import { MatchJoin } from './entities/match-join.entity';
import { MatchJoinResponseDto } from './dto/match-join-response.dto';
import { JoinStatus } from 'src/team-member-join/entities/join-status.enum';

@Controller('api/matches')
export class MatchJoinController {
  constructor(private readonly matchJoinService: MatchJoinService) {}

  @Post('/:matchId/join')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.USER)
  async joinMatch(
    @Param('matchId', ParseIntPipe) matchId: number,
    @GetUser() user: User,
  ): Promise<ApiResponseDto<void>> {
    await this.matchJoinService.requestJoin(matchId, user);
    return new ApiResponseDto(true, HttpStatus.OK, '경기 신청 완료');
  }

  @Get('/:matchId/join/all')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.USER)
  async getJoinRequests(
    @Param('matchId', ParseIntPipe) matchId: number,
    @GetUser() user: User,
  ): Promise<ApiResponseDto<MatchJoinResponseDto[]>> {
    const joins = await this.matchJoinService.getJoinRequests(matchId, user);
    const responseDtos = joins.map((join) => new MatchJoinResponseDto(join));
    return new ApiResponseDto(
      true,
      HttpStatus.OK,
      '신청 목록 조회 성공',
      responseDtos,
    );
  }

  // match-join.controller.ts

  @Patch('/:matchId/join/:joinId/status')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.USER)
  async updateJoinStatus(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Param('joinId', ParseIntPipe) joinId: number,
    @Body('status', new ParseEnumPipe(JoinStatus)) status: JoinStatus,
    @GetUser() user: User,
  ): Promise<ApiResponseDto<void>> {
    await this.matchJoinService.updateJoinStatus(matchId, joinId, user, status);
    return new ApiResponseDto(
      true,
      HttpStatus.OK,
      '경기 신청 상태 업데이트 완료',
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMatchJoinDto: UpdateMatchJoinDto,
  ) {
    return this.matchJoinService.update(+id, updateMatchJoinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchJoinService.remove(+id);
  }
}
