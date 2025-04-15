import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Board } from './board.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { TradeStatus } from '../enums/trade-status.enum';

@Entity()
export class TradePost {
  @PrimaryGeneratedColumn()
  trade_post_id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  file: string;

  @Column({ type: 'enum', enum: TradeStatus, default: TradeStatus.AVAILABLE }) // ✅ Enum 적용
  trade_status: TradeStatus;

  // Board와의 관계 설정
  @ManyToOne(() => Board, (board) => board.tradePosts, { onDelete: 'CASCADE' })
  board: Board;

  // User와의 관계 설정 (작성자)
  @ManyToOne(() => User, (user) => user.tradePosts, { onDelete: 'CASCADE' })
  author: User;

  // Comment와의 관계 설정
  @OneToMany(() => Comment, (comment) => comment.tradePost, { cascade: true })
  comments: Comment[];
}
