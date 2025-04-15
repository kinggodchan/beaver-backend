import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Post } from 'src/board/entities/post.entity';
import { TradePost } from 'src/board/entities/trade-post.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(TradePost) private tradeRepo: Repository<TradePost>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  /** 📌 댓글 생성 */
  async createComment(
    dto: CreateCommentDto,
    userId: number,
    postId: number,
    boardId: number
  ): Promise<Comment> {
    const user = await this.userRepo.findOne({ where: { user_id: userId } });
    if (!user) throw new NotFoundException('작성자 정보가 없습니다.');

    let post: Post | null = null;
    let tradePost: TradePost | null = null;

    if (boardId === 1) {
      post = await this.postRepo.findOne({ where: { post_id: postId } });
      if (!post) throw new NotFoundException('정보 게시글이 존재하지 않습니다.');
    } else if (boardId === 2) {
      tradePost = await this.tradeRepo.findOne({ where: { trade_post_id: postId } });
      if (!tradePost) throw new NotFoundException('거래 게시글이 존재하지 않습니다.');
    } else {
      throw new NotFoundException('유효하지 않은 board_id입니다.');
    }

    const comment = new Comment();
    comment.content = dto.content;
    comment.author = user;
    comment.board_id = boardId; // ✅ 추가

    if (post) comment.post = post;
    if (tradePost) comment.tradePost = tradePost;

    return await this.commentRepo.save(comment);
  }

  /** 📌 특정 게시글의 댓글 조회 (boardId 필터링) */
  async getCommentsByPostId(postId: number, boardId: number): Promise<Comment[]> {
    if (boardId === 1) {
      return await this.commentRepo.find({
        where: { post: { post_id: postId } },
        relations: ['author'],
        order: { createdAt: 'ASC' },
      });
    } else if (boardId === 2) {
      return await this.commentRepo.find({
        where: { tradePost: { trade_post_id: postId } },
        relations: ['author'],
        order: { createdAt: 'ASC' },
      });
    } else {
      throw new NotFoundException('유효하지 않은 board_id입니다.');
    }
  }

  /** 📌 댓글 수정 */
  async updateComment(id: number, dto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepo.findOne({ where: { comment_id: id } });
    if (!comment) throw new NotFoundException('댓글을 찾을 수 없습니다.');
    comment.content = dto.content;
    return this.commentRepo.save(comment);
  }

  /** 📌 댓글 삭제 */
  async deleteComment(id: number): Promise<string> {
    const result = await this.commentRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    return '댓글이 삭제되었습니다.';
  }

  /** 🔒 댓글 수정/삭제 권한 체크 */
  async checkOwnership(commentId: number, userId: number): Promise<boolean> {
    const comment = await this.commentRepo.findOne({
      where: { comment_id: commentId },
      relations: ['author'],
    });
    return comment?.author?.user_id === userId;
  }
}
