import { Module } from '@nestjs/common';
import { MatchResultService } from './match-result.service';
import { MatchResultController } from './match-result.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchResult } from './entities/match-result.entity';
import { Match } from 'src/match/entities/match.entity';
import { PassportModule } from '@nestjs/passport';
import { Team } from 'src/teams/entities/team.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchResult, Match, Team]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [MatchResultController],
  providers: [MatchResultService],
})
export class MatchResultModule {}
