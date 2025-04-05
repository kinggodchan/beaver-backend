import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMatchResultDto } from './dto/create-match-result.dto';
import { UpdateMatchResultDto } from './dto/update-match-result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchResult } from './entities/match-result.entity';
import { Repository } from 'typeorm';
import { Match } from 'src/match/entities/match.entity';
import { MatchStatus } from 'src/match/entities/math-status.enum';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MatchResultService {
  constructor(
    @InjectRepository(MatchResult)
    private matchResultRepo: Repository<MatchResult>,

    @InjectRepository(Match)
    private matchRepo: Repository<Match>,
  ) {}

  async createResult(
    matchId: number,
    dto: CreateMatchResultDto,
    user: User,
  ): Promise<void> {
    const match = await this.matchRepo.findOne({
      where: { match_id: matchId },
    });

    if (!match) throw new NotFoundException('경기를 찾을 수 없습니다.');

    if (match.host_team.captain.user_id !== user.user_id) {
      throw new ForbiddenException(
        '경기 결과는 주최팀 주장만 입력할 수 있습니다.',
      );
    }

    const existing = await this.matchResultRepo.findOne({ where: { match } });
    if (existing) throw new ConflictException('이미 결과가 등록된 경기입니다.');

    const result = this.matchResultRepo.create({
      match,
      host_score: dto.host_score,
      opponent_score: dto.opponent_score,
    });

    await this.matchResultRepo.save(result);

    match.status = MatchStatus.FINISHED;
    await this.matchRepo.save(match);
  }

  // match-result.service.ts
  async getResultByMatchId(matchId: number): Promise<MatchResult> {
    const match = await this.matchRepo.findOne({
      where: { match_id: matchId },
    });
    if (!match) {
      throw new NotFoundException('경기를 찾을 수 없습니다.');
    }

    const result = await this.matchResultRepo.findOne({
      where: { match: { match_id: matchId } },
      relations: ['match', 'match.host_team', 'match.opponent_team'],
    });

    if (!result) {
      throw new NotFoundException(
        '해당 경기의 결과가 아직 등록되지 않았습니다.',
      );
    }

    return result;
  }

  update(id: number, updateMatchResultDto: UpdateMatchResultDto) {
    return `This action updates a #${id} matchResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} matchResult`;
  }
}
