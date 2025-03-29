import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Team } from 'src/teams/entities/team.entity';
import { Match } from 'src/match/entities/match.entity';
import { JoinStatus } from 'src/team-member-join/entities/join-status.enum';

@Entity()
export class MatchJoin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Match, (match) => match.match_id, { onDelete: 'CASCADE' })
  match: Match;

  @ManyToOne(() => Team, { eager: true, onDelete: 'CASCADE' })
  team: Team;

  @Column({ default: JoinStatus.PENDING })
  status: JoinStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
