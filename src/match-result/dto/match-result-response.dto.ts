import { MatchResult } from "../entities/match-result.entity";

// dto/match-result-summary.dto.ts
export class MatchResultResponseDto {
	id: number;
	host_score: number;
	opponent_score: number;
  
	constructor(result: MatchResult) {
	  this.id = result.id;
	  this.host_score = result.host_score;
	  this.opponent_score = result.opponent_score;
	}
  }
  