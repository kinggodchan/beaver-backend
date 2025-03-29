import { Module } from '@nestjs/common';
import { MatchJoinService } from './match-join.service';
import { MatchJoinController } from './match-join.controller';

@Module({
  controllers: [MatchJoinController],
  providers: [MatchJoinService],
})
export class MatchJoinModule {}
