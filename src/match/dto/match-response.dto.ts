// dto/match-response.dto.ts
import { MatchResultResponseDto } from 'src/match-result/dto/match-result-response.dto';
import { Match } from '../entities/match.entity';
import { TeamResponseDto } from 'src/teams/dto/team-response.dto';

export class MatchResponseDto {
  match_id: number;
  host_team: TeamResponseDto;
  opponent_team?: TeamResponseDto;
  match_date: Date;
  location: string;
  status: string;
  result?: MatchResultResponseDto;

  constructor(match: Match) {
    this.match_id = match.match_id;
    this.host_team = new TeamResponseDto(match.host_team);
    this.match_date = match.match_date;
    this.location = match.location;
    this.status = match.status;

    if (match.result) {
      this.result = new MatchResultResponseDto(match.result);
    }
    if (match.opponent_team) {
      this.opponent_team = new TeamResponseDto(match.opponent_team);
    }
  }
}
