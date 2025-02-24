import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsNumber()
  board_id?: number;  // 추가

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
