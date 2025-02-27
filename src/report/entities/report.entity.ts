import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Team } from 'src/teams/entities/team.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  report_id: number;

  @ManyToOne(() => Team, (team) => team.reportsMade, { onDelete: 'CASCADE' })
  reporterTeam: Team; // 신고한 팀

  @ManyToOne(() => Team, (team) => team.reportsReceived, { onDelete: 'CASCADE' })
  reportedTeam: Team; // 신고당한 팀

  @Column({ type: 'text' })
  reason: string; // 신고 사유

  @CreateDateColumn()
  createdAt: Date;
}
