import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Board } from './board.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  // Board와의 관계 설정
  @ManyToOne(() => Board, (board) => board.posts, { onDelete: 'CASCADE' })
  board: Board;
}
