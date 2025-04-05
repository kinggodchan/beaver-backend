// dto/match-response.dto.ts
import { MatchResultResponseDto } from 'src/match-result/dto/match-result-response.dto';
import { Match } from '../entities/match.entity';

export class MatchResponseDto {
  match_id: number;
  host_team_id: number;
  host_team_name: string;
  opponent_team_id?: number;
  opponent_team_name?: string;
  match_date: Date;
  location: string;
  status: string;
  result?: MatchResultResponseDto;

  constructor(match: Match) {
    this.match_id = match.match_id;
    this.host_team_id = match.host_team.team_id;
    this.host_team_name = match.host_team.team_name;
    this.opponent_team_id = match.opponent_team?.team_id;
    this.opponent_team_name = match.opponent_team?.team_name;
    this.match_date = match.match_date;
    this.location = match.location;
    this.status = match.status;

    // ✅ result 있을 때만 요약 형태로 담기
    if (match.result) {
      this.result = new MatchResultResponseDto(match.result);
    }
  }
}
