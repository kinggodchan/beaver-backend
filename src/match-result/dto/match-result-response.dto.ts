import { MatchResult } from '../entities/match-result.entity';

// dto/match-result-summary.dto.ts
export class MatchResultResponseDto {
  id: number;
  host_score: number;
  opponent_score: number;
  host_rating: number;
  opponent_rating: number;
  host_rating_after: number;
  opponent_rating_after: number;

  constructor(result: MatchResult) {
    this.id = result.id;
    this.host_score = result.host_score;
    this.opponent_score = result.opponent_score;
    this.host_rating = result.host_rating;
    this.opponent_rating = result.opponent_rating;
    this.host_rating_after = result.host_rating_after;
    this.opponent_rating_after = result.opponent_rating_after;
  }
}
