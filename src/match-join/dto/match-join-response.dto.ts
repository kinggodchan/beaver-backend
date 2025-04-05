// match-join-response.dto.ts
import { MatchJoin } from '../entities/match-join.entity';
import { Team } from 'src/teams/entities/team.entity';

export class MatchJoinResponseDto {
  id: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  team: {
    team_id: number;
    team_name: string;
    team_logo: string;
    description: string;
    member_count: number;
  };

  constructor(join: MatchJoin) {
    this.id = join.id;
    this.status = join.status;
    this.created_at = join.created_at;
    this.updated_at = join.updated_at;
    this.team = {
      team_id: join.team.team_id,
      team_name: join.team.team_name,
      team_logo: join.team.team_logo,
      description: join.team.description,
      member_count: join.team.member_count,
    };
  }
}
