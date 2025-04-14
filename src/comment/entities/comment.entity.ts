import { Post } from 'src/board/entities/post.entity';
import { TradePost } from 'src/board/entities/trade-post.entity';
import { User } from 'src/users/entities/user.entity';
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  comment_id: number;

  @Column({ type: 'text' })
  content: string;

  // 게시판 구분 (1: 정보 게시판, 2: 거래 게시판)
  @Column()
  board_id: number;

  // 일반 게시글과의 관계
  @ManyToOne(() => Post, (post) => post.comments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  post?: Post;

  // 거래 게시글과의 관계
  @ManyToOne(() => TradePost, (tradePost) => tradePost.comments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  tradePost?: TradePost;

  // 작성자와의 관계
  @ManyToOne(() => User, (user) => user.comments, {
    eager: false,
    onDelete: 'CASCADE',
  })
  author: User;

  // 생성/수정 시간
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

