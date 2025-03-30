import { Module } from '@nestjs/common';
import { MatchResultService } from './match-result.service';
import { MatchResultController } from './match-result.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchResult } from './entities/match-result.entity';
import { Match } from 'src/match/entities/match.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchResult, Match]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [MatchResultController],
  providers: [MatchResultService],
})
export class MatchResultModule {}
