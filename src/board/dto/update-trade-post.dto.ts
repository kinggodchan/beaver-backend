import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateTradePostDto {
  @IsOptional()
  @IsNumber()
  board_id?: number;  // 추가

  @IsOptional()
  @IsString()
  item_name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
