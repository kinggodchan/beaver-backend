import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Post } from 'src/board/entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  /** 📌 댓글 생성 */
  async createComment(dto: CreateCommentDto): Promise<Comment> {
    const post = await this.postRepo.findOne({ where: { post_id: dto.post_id } });
    if (!post) throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');

    const author = await this.userRepo.findOne({ where: { user_id: dto.author_id } });
    if (!author) throw new NotFoundException('작성자를 찾을 수 없습니다.');

    const comment = this.commentRepo.create({ ...dto, post, author });
    return this.commentRepo.save(comment);
  }

  /** 📌 특정 게시글(post_id)의 댓글 조회 */
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    const comments = await this.commentRepo.find({
      where: { post: { post_id: postId } },
      relations: ['author', 'post'],
    });

    if (!comments.length) {
      throw new NotFoundException(`게시글 ID ${postId}에 대한 댓글이 없습니다.`);
    }

    return comments;
  }

  /** 📌 댓글 수정 */
  async updateComment(id: number, dto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepo.preload({ comment_id: id, ...dto });

    if (!comment) throw new NotFoundException(`Comment with ID ${id} not found`);

    return this.commentRepo.save(comment);
  }

/** 📌 댓글 삭제 */
async deleteComment(id: number): Promise<string> {
  const result = await this.commentRepo.delete(id);
  if (result.affected === 0) {
    throw new NotFoundException(`Comment with ID ${id} not found`);
  }

  return '댓글이 삭제되었습니다.';  // 성공 메시지 반환
}

}
