import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { TeamScheduleService } from './team-schedule.service';
import { CreateTeamScheduleDto } from './dto/create-team-schedule.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.guard';


@Controller('api/team-schedule')
export class TeamScheduleController {
  constructor(private readonly scheduleService: TeamScheduleService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':teamId')
  createSchedule(@Request() req, @Param('teamId') teamId: number, @Body() dto: CreateTeamScheduleDto) {
    return this.scheduleService.createSchedule(req.user, teamId, dto);
  }

  @Get(':teamId')
  getSchedules(@Param('teamId') teamId: number) {
    return this.scheduleService.getSchedules(teamId);
  }
}
