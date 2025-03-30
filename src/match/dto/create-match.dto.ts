import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateMatchDto {
  @IsNotEmpty()
  @IsDateString()
  match_date: string;

  @IsNotEmpty()
  @IsString()
  location: string;
}