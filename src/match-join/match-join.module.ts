import { Module } from '@nestjs/common';
import { MatchJoinService } from './match-join.service';
import { MatchJoinController } from './match-join.controller';
import { Match } from 'src/match/entities/match.entity';
import { Team } from 'src/teams/entities/team.entity';
import { MatchJoin } from './entities/match-join.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchJoin, Match, Team]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [MatchJoinController],
  providers: [MatchJoinService],
})
export class MatchJoinModule {}
