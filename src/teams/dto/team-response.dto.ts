import { Team } from '../entities/team.entity';

export class TeamResponseDto {
  team_id: number;
  team_name: string;
  location: string;
  member_count: number;
  team_logo: string;
  description: string;
  //captain: string;

  constructor(team: Team) {
    this.team_id = team.team_id;
    this.team_name = team.team_name;
    this.location = team.location;
    this.member_count = team.member_count;
    this.team_logo = team.team_logo;
    this.description = team.description;
    //captain: string;
  }
}
