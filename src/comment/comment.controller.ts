import { Controller, Post, Get, Body, Patch, Param, Delete, Query } from '@nestjs/common';
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

  /** 📌 특정 게시글(post_id)의 댓글 조회 */
  @Get()
  getComments(@Query('post_id') postId: string) {
    return this.commentService.getCommentsByPostId(parseInt(postId, 10));
  }

  /** 📌 댓글 수정 */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.updateComment(parseInt(id, 10), updateCommentDto);
  }

  /** 📌 댓글 삭제 */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.deleteComment(parseInt(id, 10));
  }
}
