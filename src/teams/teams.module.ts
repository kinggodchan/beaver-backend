import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Team } from './entities/team.entity';
import { PassportModule } from '@nestjs/passport';
import { TeamMemberJoin } from 'src/team-member-join/entities/team-member-join.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, TeamMemberJoin]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService]
})
export class TeamsModule {}
