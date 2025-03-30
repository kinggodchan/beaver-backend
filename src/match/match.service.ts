import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { Team } from 'src/teams/entities/team.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,

    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  async createMatch(user: User, dto: CreateMatchDto): Promise<Match> {
    const team = await this.teamRepository.findOne({
      where: { captain: { user_id: user.user_id } },
    });

    if (!team) {
      throw new NotFoundException('소속된 팀을 찾을 수 없습니다.');
    }

    const match = this.matchRepository.create({
      host_team: team,
      match_date: new Date(dto.match_date),
      location: dto.location,
    });

    return await this.matchRepository.save(match);
  }

  // match.service.ts
  async getAllMatches(): Promise<Match[]> {
    return this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.result', 'result')
      .leftJoinAndSelect('match.host_team', 'host_team')
      .leftJoinAndSelect('match.opponent_team', 'opponent_team')
      .orderBy('match.match_date', 'DESC')
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} match`;
  }

  update(id: number, updateMatchDto: UpdateMatchDto) {
    return `This action updates a #${id} match`;
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }
}
