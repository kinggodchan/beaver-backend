import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Board } from './board.entity';
import { Comment } from '../../comment/entities/comment.entity';

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

  // Comment와의 관계 설정
  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];
}
