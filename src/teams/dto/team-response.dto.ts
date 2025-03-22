import { Team } from '../entities/team.entity';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class TeamResponseDto {
  team_id: number;
  team_name: string;
  location: string;
  member_count: number;
  team_logo: string;
  description: string;
  captain: UserResponseDto | null;

  constructor(team: Team) {
    this.team_id = team.team_id;
    this.team_name = team.team_name;
    this.location = team.location;
    this.member_count = team.member_count;
    this.team_logo = team.team_logo;
    this.description = team.description;
    this.captain = team.captain ? new UserResponseDto(team.captain) : null;
  }
}
