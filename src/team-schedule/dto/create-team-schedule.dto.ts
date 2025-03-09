import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamScheduleDto {
  @IsDateString()
  match_date: string; // ISO8601 날짜 형식

  @IsString()
  @IsNotEmpty()
  location: string;
}
