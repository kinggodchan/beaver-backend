// dto/match-response.dto.ts
import { Match } from '../entities/match.entity';

export class MatchResponseDto {
  match_id: number;
  host_team_id: number;
  opponent_team_id?: number;
  match_date: Date;
  location: string;
  status: string;

  constructor(match: Match) {
    this.match_id = match.match_id;
    this.host_team_id = match.host_team.team_id;
    this.opponent_team_id = match.opponent_team?.team_id;
    this.match_date = match.match_date;
    this.location = match.location;
    this.status = match.status;
  }
}
