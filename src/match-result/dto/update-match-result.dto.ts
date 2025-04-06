import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchResultDto } from './create-match-result.dto';
import { IsInt, Min } from 'class-validator';

export class UpdateMatchResultDto extends PartialType(CreateMatchResultDto) {
  @IsInt()
  @Min(0)
  host_score: number;

  @IsInt()
  @Min(0)
  opponent_score: number;
}
