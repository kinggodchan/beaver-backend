import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamSchedule } from './entities/team-schedule.entity';
import { CreateTeamScheduleDto } from './dto/create-team-schedule.dto';
import { User } from 'src/users/entities/user.entity';
import { Team } from 'src/teams/entities/team.entity';

@Injectable()
export class TeamScheduleService {
  constructor(
    @InjectRepository(TeamSchedule)
    private readonly scheduleRepository: Repository<TeamSchedule>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async createSchedule(user: User, teamId: number, dto: CreateTeamScheduleDto): Promise<TeamSchedule> {
    const team = await this.teamRepository.findOne({ where: { team_id: teamId }, relations: ['captain'] });

    if (!team) {
      throw new NotFoundException('팀을 찾을 수 없습니다.');
    }

    if (team.captain.user_id !== user.user_id) {
      throw new ForbiddenException('매니저만 경기 일정을 추가할 수 있습니다.');
    }

    const schedule = this.scheduleRepository.create({ ...dto, team });
    return this.scheduleRepository.save(schedule);
  }

  async getSchedules(teamId: number): Promise<TeamSchedule[]> {
    return this.scheduleRepository.find({ where: { team: { team_id: teamId } } });
  }
}
