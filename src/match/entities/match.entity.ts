import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Team } from 'src/teams/entities/team.entity';
import { MatchResult } from 'src/match-result/entities/match-result.entity';
import { MatchStatus } from './math-status.enum';


@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  match_id: number;

  @ManyToOne(() => Team, { eager: true })
  host_team: Team; // 주최 팀

  @ManyToOne(() => Team, { nullable: true, eager: true })
  opponent_team: Team; // 상대 팀 (선택된 후 저장)

  @Column()
  match_date: Date;

  @Column()
  location: string;

  @Column({default: MatchStatus.WAITING })
  status: MatchStatus;

  @OneToOne(() => MatchResult, (result) => result.match, { nullable: true })
  result: MatchResult;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
