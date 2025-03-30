// create-match-result.dto.ts
import { IsInt, Min } from 'class-validator';

export class CreateMatchResultDto {
  @IsInt()
  @Min(0)
  host_score: number;

  @IsInt()
  @Min(0)
  opponent_score: number;
}
