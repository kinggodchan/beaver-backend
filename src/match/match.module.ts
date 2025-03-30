import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/teams/entities/team.entity';
import { Match } from './entities/match.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Team]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
