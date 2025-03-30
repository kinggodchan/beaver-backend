import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMatchJoinDto } from './dto/create-match-join.dto';
import { UpdateMatchJoinDto } from './dto/update-match-join.dto';
import { User } from 'src/users/entities/user.entity';
import { MatchJoin } from './entities/match-join.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from 'src/teams/entities/team.entity';
import { MatchStatus } from 'src/match/entities/math-status.enum';
import { Match } from 'src/match/entities/match.entity';
import { JoinStatus } from 'src/team-member-join/entities/join-status.enum';

@Injectable()
export class MatchJoinService {
  constructor(
    @InjectRepository(MatchJoin)
    private matchJoinRepository: Repository<MatchJoin>,

    @InjectRepository(Match)
    private matchRepository: Repository<Match>,

    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  // match-join.service.ts
  async requestJoin(matchId: number, user: User): Promise<void> {
    const match = await this.matchRepository.findOne({
      where: { match_id: matchId },
      relations: ['host_team'],
    });

    if (!match) throw new NotFoundException('경기를 찾을 수 없습니다.');
    if (match.status !== MatchStatus.WAITING) {
      throw new BadRequestException('신청 가능한 상태가 아닙니다.');
    }

    const team = await this.teamRepository
      .createQueryBuilder('team')
      .leftJoin('team.captain', 'captain')
      .where('captain.user_id = :userId', { userId: user.user_id })
      .getOne();

    if (!team) throw new NotFoundException('소속된 팀을 찾을 수 없습니다.');

    // 자기 자신 경기에 신청 못 하도록 방지
    if (match.host_team.team_id === team.team_id) {
      throw new BadRequestException('자신의 경기에는 신청할 수 없습니다.');
    }

    const existing = await this.matchJoinRepository.findOne({
      where: { match: { match_id: matchId }, team: { team_id: team.team_id } },
    });
    if (existing) {
      throw new ConflictException('이미 신청한 경기입니다.');
    }

    const matchJoin = this.matchJoinRepository.create({
      match,
      team,
      status: JoinStatus.PENDING,
    });

    await this.matchJoinRepository.save(matchJoin);
  }

  // match-join.service.ts
  async getJoinRequests(matchId: number, user: User): Promise<MatchJoin[]> {
    const match = await this.matchRepository.findOne({
      where: { match_id: matchId },
      relations: ['host_team', 'host_team.captain'],
    });
    

    if (!match) throw new NotFoundException('경기를 찾을 수 없습니다.');
    if (match.host_team.captain.user_id !== user.user_id) {
      throw new ForbiddenException('신청 목록은 주최팀 주장만 볼 수 있습니다.');
    }

    return await this.matchJoinRepository.find({
      where: { match: { match_id: matchId } },
      relations: ['team'],
      order: { created_at: 'DESC' },
    });
    
  }

  findOne(id: number) {
    return `This action returns a #${id} matchJoin`;
  }

  update(id: number, updateMatchJoinDto: UpdateMatchJoinDto) {
    return `This action updates a #${id} matchJoin`;
  }

  remove(id: number) {
    return `This action removes a #${id} matchJoin`;
  }
}
