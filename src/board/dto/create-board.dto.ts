import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BoardType } from '../entities/board.entity';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  board_name: BoardType;

  @IsEnum(BoardType)
  @IsNotEmpty()
  type: BoardType;
}
