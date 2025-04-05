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

  // match 전체 정보 확인
  async getAllMatches(): Promise<Match[]> {
    return this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.result', 'result')
      .leftJoinAndSelect('match.host_team', 'host_team')
      .leftJoinAndSelect('match.opponent_team', 'opponent_team')
      .orderBy('match.match_date', 'DESC')
      .getMany();
  }

  // 날짜별 경기 확인
  async getMatchesByDate(date: string): Promise<Match[]> {
    return await this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.host_team', 'host_team')
      .leftJoinAndSelect('match.opponent_team', 'opponent_team')
      .leftJoinAndSelect('match.result', 'result')
      .where('DATE(match.match_date) = :date', { date })
      .orderBy('match.match_date', 'ASC')
      .getMany();
  }

  // 팀별 경기 확인
  async getTeamMatches(teamId: number): Promise<Match[]> {
    return this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.host_team', 'host_team')
      .leftJoinAndSelect('match.opponent_team', 'opponent_team')
      .leftJoinAndSelect('match.result', 'result')
      .where('host_team.team_id = :teamId', { teamId })
      .orWhere('opponent_team.team_id = :teamId', { teamId })
      .orderBy('match.match_date', 'ASC')
      .getMany();
  }

  // 개별 경기 확인
  async getMatchById(matchId: number): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { match_id: matchId },
      relations: ['host_team', 'opponent_team', 'result'],
    });
    if (!match) {
      throw new NotFoundException(`ID가 ${matchId}인 경기를 찾을 수 없습니다.`);
    }
    return match;
  }

  update(id: number, updateMatchDto: UpdateMatchDto) {
    return `This action updates a #${id} match`;
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }
}
