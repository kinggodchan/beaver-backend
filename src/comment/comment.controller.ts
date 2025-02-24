import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /** 📌 댓글 생성 */
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(createCommentDto);
  }

  /** 📌 댓글 수정 */
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.updateComment(id, updateCommentDto);
  }

  /** 📌 댓글 삭제 */
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commentService.deleteComment(id);
  }
}
