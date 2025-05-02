import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
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
import { Team } from 'src/teams/entities/team.entity';

@Injectable()
export class MatchResultService {
  private readonly logger = new Logger(MatchResult.name);
  constructor(
    @InjectRepository(MatchResult)
    private matchResultRepo: Repository<MatchResult>,

    @InjectRepository(Match)
    private matchRepo: Repository<Match>,

    @InjectRepository(Team)
    private teamRepo: Repository<Team>,
  ) {}

  // 결과 등록
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

    match.result = result;
    match.status = MatchStatus.FINISHED;
    await this.matchRepo.save(match);

    const resultedMatch = await this.matchRepo.findOne({
      where: { match_id: matchId },
    });
    if (!resultedMatch) throw new NotFoundException('경기를 찾을 수 없습니다.');
    await this.setRating(resultedMatch);
  }

  // 결과 조회
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

  // 결과 수정
  async updateMatchResult(
    matchId: number,
    dto: UpdateMatchResultDto,
    user: User,
  ): Promise<void> {
    const match = await this.matchRepo.findOne({
      where: { match_id: matchId },
      relations: ['host_team', 'host_team.captain', 'result'],
    });

    if (!match) throw new NotFoundException('경기를 찾을 수 없습니다.');

    // 주최팀 주장만 가능
    if (match.host_team.captain.user_id !== user.user_id) {
      throw new ForbiddenException('경기 결과 수정 권한이 없습니다.');
    }

    if (match.result) {
      // 기존 결과 수정
      match.result.host_score = dto.host_score;
      match.result.opponent_score = dto.opponent_score;
      await this.matchResultRepo.save(match.result);
    } else {
      // 새 결과 생성
      const result = this.matchResultRepo.create({
        match,
        host_score: dto.host_score,
        opponent_score: dto.opponent_score,
      });
      await this.matchResultRepo.save(result);

      match.result = result;
    }
    await this.matchRepo.save(match);
    await this.setRating(match);
  }

  remove(id: number) {
    return `This action removes a #${id} matchResult`;
  }

  // 승패, 득실, 레이팅 저장
  async setRating(match: Match) {
    const host: Team = match.host_team;
    const opponent: Team = match.opponent_team;
    const result: MatchResult = match.result;
    const goalDifference: number = Math.abs(
      result.host_score - result.opponent_score,
    );
    const hostExpectRate: number = this.expectRate(
      host.rating,
      opponent.rating,
    );
    const opponentExpectRate: number = this.expectRate(
      opponent.rating,
      host.rating,
    );

    host.goals_for += result.host_score;
    host.goals_against += result.opponent_score;

    opponent.goals_for += result.opponent_score;
    opponent.goals_against += result.host_score;

    if (result.host_score > result.opponent_score) {
      host.wins += 1;
      opponent.losses += 1;
      host.rating = this.newRating(
        host.rating,
        1,
        hostExpectRate,
        goalDifference,
      );
      opponent.rating = this.newRating(
        opponent.rating,
        0,
        opponentExpectRate,
        goalDifference,
      );
    } else if (result.host_score < result.opponent_score) {
      opponent.wins += 1;
      host.losses += 1;
      opponent.rating = this.newRating(
        opponent.rating,
        1,
        opponentExpectRate,
        goalDifference,
      );
      host.rating = this.newRating(
        host.rating,
        0,
        hostExpectRate,
        goalDifference,
      );
    } else {
      host.draws += 1;
      opponent.draws += 1;
      host.rating = this.newRating(
        host.rating,
        0.5,
        hostExpectRate,
        goalDifference,
      );
      opponent.rating = this.newRating(
        opponent.rating,
        0.5,
        opponentExpectRate,
        goalDifference,
      );
    }

    await this.teamRepo.save(host);
    await this.teamRepo.save(opponent);
  }

  // 레이팅 계산 관련 함수
  // 예상 승률
  expectRate(ratingA: number, ratingB: number): number {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 600));
  }

  // 득실차 보정값
  goalDifferenceMultiplier(goalDifference: number): number {
    if (goalDifference <= 1) return 1;
    else if (goalDifference == 2) return 1.5;
    else if (goalDifference < 10) return (11 + goalDifference) / 8;
    else return 2.5;
  }

  newRating(
    currentRating: number,
    matchResult: number,
    expectRate: number,
    goalDifference: number,
  ): number {
    const k = 30;
    const g = this.goalDifferenceMultiplier(goalDifference);
    return currentRating + k * g * (matchResult - expectRate);
  }
}
