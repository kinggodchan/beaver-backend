import { Module } from '@nestjs/common';
import { TeamMemberJoinService } from './team-member-join.service';
import { TeamMemberJoinController } from './team-member-join.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMemberJoin } from './entities/team-member-join.entity';
import { Team } from 'src/teams/entities/team.entity';
import { User } from 'src/users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
      TypeOrmModule.forFeature([TeamMemberJoin, Team, User]),
      PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
  controllers: [TeamMemberJoinController],
  providers: [TeamMemberJoinService],
})
export class TeamMemberJoinModule {}
