import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateTeamRequestDto {
  @IsNotEmpty()
  @IsString()
  team_name: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  // 팀 소개글
  @IsString()
  @IsNotEmpty()
  description: string;

  // 팀 로고 (URL 형식)
  @IsOptional()
  @IsUrl()
  team_logo?: string;
}
