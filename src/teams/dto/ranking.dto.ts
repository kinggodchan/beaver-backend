import { Team } from "../entities/team.entity";

export class TeamRankingDto {
  team_id: number;
  team_name: string;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  rating: number;

  constructor(team: Team) {
      this.team_id = team.team_id;
      this.team_name = team.team_name;
      this.wins = team.wins;
      this.draws = team.draws;
      this.losses = team.losses;
      this.goals_for = team.goals_for;
      this.goals_against = team.goals_against;
      this.rating = team.rating;
    }
}
