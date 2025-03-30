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

  @Column({ nullable: true })
  winner_team: string; // 팀명 또는 ID로 교체 가능

  @Column({ nullable: true })
  description: string; // 예: "연장전", "승부차기", 기타 메모

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
