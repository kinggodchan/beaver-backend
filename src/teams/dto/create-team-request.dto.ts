import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateTeamRequestDto {
  @IsNotEmpty()
  @IsString()
  team_name: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  // 팀 소개글
  @IsNotEmpty()
  @IsString()
  description: string;

}
