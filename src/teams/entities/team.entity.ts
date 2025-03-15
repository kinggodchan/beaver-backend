import { User } from 'src/users/entities/user.entity';  // 유저 엔티티 추가
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn, JoinTable, OneToMany, OneToOne, JoinColumn } from 'typeorm';

import { Report } from 'src/report/entities/report.entity';
import { TeamSchedule } from 'src/team-schedule/entities/team-schedule.entity';
import { TeamMemberJoin } from 'src/team-member-join/entities/team-member-join.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  team_id: number;

  @Column({ length: 100 })
  team_name: string;

  // 매니저로 설정된 유저를 나타냄
  @JoinColumn()
  @OneToOne(() => User, { eager: true })
  captain: User;

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
  @Column({ nullable: true })
  team_logo: string;

  // 한 팀이 여러 경기 일정 get
  @OneToMany(() => TeamSchedule, (schedule) => schedule.team, { cascade: true })
  schedules: TeamSchedule[];

  // team.entity.ts
  @OneToMany(() => TeamMemberJoin, (teamMemberJoin) => teamMemberJoin.team)
  members: TeamMemberJoin[];

  // 추가된 부분: 팀 신고 관계
  @OneToMany(() => Report, (report) => report.reporterTeam, { cascade: true })
  reportsMade: Report[]; // 이 팀이 신고한 신고 목록

  @OneToMany(() => Report, (report) => report.reportedTeam, { cascade: true })
  reportsReceived: Report[]; // 이 팀이 신고받은 신고 목록
}
