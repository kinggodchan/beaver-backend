import { Post } from 'src/board/entities/post.entity';
import { TradePost } from 'src/board/entities/trade-post.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  comment_id: number;

  @Column()
  content: string;

  // Post와의 관계 설정 (일반 게시글)
  @ManyToOne(() => Post, (post) => post.comments, { nullable: true, onDelete: 'CASCADE' })
  post?: Post;

  // TradePost와의 관계 설정 (거래 게시글)
  @ManyToOne(() => TradePost, (tradePost) => tradePost.comments, { nullable: true, onDelete: 'CASCADE' })
  tradePost?: TradePost;

  // User와의 관계 설정 (댓글 작성자)
  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' }) // ✅ 수정됨
  author: User;
}
