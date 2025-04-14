import {Controller,Post as HttpPost,Get,Patch,Delete,Param,Body,UseGuards,Request,ForbiddenException,ParseIntPipe} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /** 📌 댓글 생성 (로그인 필요) */
  @HttpPost(':boardId/:postId')
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() dto: CreateCommentDto,
    @Param('postId', ParseIntPipe) postId: number,  // ✅ 여기 ParseIntPipe 추가
    @Param('boardId', ParseIntPipe) boardId: number,
    @Request() req,
  ) {
    const userId = req.user.user_id;
    return this.commentService.createComment(dto, userId, postId, boardId);
  }

  /** 📌 특정 게시글(post_id)의 댓글 조회 */
  @Get('post/:postId/:boardId')
  getComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.commentService.getCommentsByPostId(postId, boardId);
  }

  /** 📌 댓글 수정 (작성자 본인만 가능) */
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
    @Request() req,
  ) {
    const userId = req.user.user_id;
    const isOwner = await this.commentService.checkOwnership(id, userId);
    if (!isOwner) throw new ForbiddenException('댓글 수정 권한이 없습니다.');
    return this.commentService.updateComment(id, dto);
  }

  /** 📌 댓글 삭제 (작성자 본인만 가능) */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.user_id;
    const isOwner = await this.commentService.checkOwnership(id, userId);
    if (!isOwner) throw new ForbiddenException('댓글 삭제 권한이 없습니다.');
    return this.commentService.deleteComment(id);
  }
}
