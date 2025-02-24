import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  post_id: number;

  @IsInt()
  author_id: number;

  @IsNotEmpty()
  content: string;
}
