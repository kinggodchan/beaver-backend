import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { TeamMemberJoin } from './team-member-join.entity';
import { Report } from 'src/report/entities/report.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  team_id: number;

  @Column({ length: 100 })
  team_name: string;
  
  @Column({ length: 255 })
  location: string;

  @Column({ default: 1 })
  member_count: number;

  @Column({ default: 0 })
  rating: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  modified_at: Date;

  // 팀 소개글
  @Column({ type: 'text'})
  description: string;  

  // 팀 로고 이미지 URL
  @Column({ type: 'varchar', length: 255, nullable: true })
  team_logo: string;

  @OneToMany(() => TeamMemberJoin, (teamMemberJoin) => teamMemberJoin.team)
  members: TeamMemberJoin[];

  @JoinColumn()
  @OneToOne(() => User, { eager: true })
  captain: User;

  // ✅ 추가된 부분: 팀 신고 관계
  @OneToMany(() => Report, (report) => report.reporterTeam, { cascade: true })
  reportsMade: Report[]; // 이 팀이 신고한 신고 목록

  @OneToMany(() => Report, (report) => report.reportedTeam, { cascade: true })
  reportsReceived: Report[]; // 이 팀이 신고받은 신고 목록
}
