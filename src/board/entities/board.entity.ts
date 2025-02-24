import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';
import { TradePost } from './trade-post.entity'; // ✅ TradePost import 추가

export enum BoardType {
  INFO = '정보게시판',
  TRADE = '거래게시판',
}

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  board_id: number;

  @Column({ length: 255 })
  boardName: string;

  @Column({ type: 'enum', enum: BoardType })
  type: BoardType;

  @OneToMany(() => Post, (post) => post.board, { cascade: true })
  posts: Post[];

  @OneToMany(() => TradePost, (tradePost) => tradePost.board, { cascade: true }) // ✅ tradePosts 추가
  tradePosts: TradePost[];
}
