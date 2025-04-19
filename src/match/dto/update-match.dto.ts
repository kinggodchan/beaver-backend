import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  @IsNotEmpty()
  @IsDateString()
  match_date: string;

  @IsNotEmpty()
  @IsString()
  location: string;
}
