import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BoardType } from '../entities/board.entity';

export class UpdateBoardDto {
  @IsString()
  @IsOptional()
  boardName?: string;

  @IsEnum(BoardType)
  @IsOptional()
  type?: BoardType;
}
