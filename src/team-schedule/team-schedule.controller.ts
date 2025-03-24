import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { TeamScheduleService } from './team-schedule.service';
import { CreateTeamScheduleDto } from './dto/create-team-schedule.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.guard';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';
import { TeamSchedule } from './entities/team-schedule.entity';

@Controller('api/team-schedule')
export class TeamScheduleController {
  constructor(private readonly scheduleService: TeamScheduleService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':teamId')
  createSchedule(
    @Request() req,
    @Param('teamId') teamId: number,
    @Body() dto: CreateTeamScheduleDto,
  ) {
    return this.scheduleService.createSchedule(req.user, teamId, dto);
  }

  @Get(':teamId')
  async getSchedules(
    @Param('teamId') teamId: number,
  ): Promise<ApiResponseDto<TeamSchedule[]>> {
    const Schedules = await this.scheduleService.getSchedules(teamId);
    return new ApiResponseDto(
      true,
      HttpStatus.OK,
      'Teams retrieved successfully',
      Schedules,
    );
  }
}
