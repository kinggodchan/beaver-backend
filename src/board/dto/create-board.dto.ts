import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BoardType } from '../entities/board.entity';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  boardName: string;

  @IsEnum(BoardType)
  @IsNotEmpty()
  type: BoardType;
}
