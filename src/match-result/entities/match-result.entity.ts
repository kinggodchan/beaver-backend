import { Entity, PrimaryGeneratedColumn, OneToOne, Column, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Match } from 'src/match/entities/match.entity';

@Entity()
export class MatchResult {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Match, (match) => match.result, { onDelete: 'CASCADE' })
  @JoinColumn()
  match: Match;

  @Column()
  host_score: number;

  @Column()
  opponent_score: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
