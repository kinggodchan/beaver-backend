import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamSchedule } from './entities/team-schedule.entity';
import { TeamScheduleService } from './team-schedule.service';
import { TeamScheduleController } from './team-schedule.controller';
import { Team } from 'src/teams/entities/team.entity';


@Module({
  imports: [TypeOrmModule.forFeature([TeamSchedule, Team])],
  controllers: [TeamScheduleController],
  providers: [TeamScheduleService],
})
export class TeamScheduleModule {}
