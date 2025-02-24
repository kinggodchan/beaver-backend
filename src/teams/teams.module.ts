import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMemberJoin } from './entities/team-member-join.entity';
import { Team } from './entities/team.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, TeamMemberJoin])
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService]
})
export class TeamsModule {}
