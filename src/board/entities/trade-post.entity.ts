import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Board } from './board.entity';

export enum TradeStatus {
  AVAILABLE = '판매중',
  SOLD = '판매완료',
}

@Entity()
export class TradePost {
  @PrimaryGeneratedColumn()
  trade_post_id: number;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'enum', enum: TradeStatus, default: TradeStatus.AVAILABLE }) // ✅ TradeStatus 추가
  status: TradeStatus;

  @ManyToOne(() => Board, (board) => board.tradePosts, { onDelete: 'CASCADE' })
  board: Board;
}

