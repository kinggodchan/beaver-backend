import { IsNotEmpty, IsInt, IsOptional } from 'class-validator';

// 게시판 종류를 명시하는 Enum
export enum BoardType {
  INFORMATION = 'information', // 정보 게시판
  TRANSACTION = 'transaction', // 거래 게시판
}

export class CreateCommentDto {
  @IsOptional()
  @IsInt()
  post_id?: number;

  @IsOptional()
  @IsInt()
  trade_post_id?: number;

  @IsNotEmpty()
  content: string;
}
