import { User } from 'src/users/entities/user.entity';  // 유저 엔티티 추가
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn, JoinTable, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { TeamMemberJoin } from './team-member-join.entity';
import { Report } from 'src/report/entities/report.entity';
import { TeamSchedule } from 'src/team-schedule/entities/team-schedule.entity';

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

  // 팀원들과의 다대다 관계 설정
  @ManyToMany(() => User, (user) => user.teams, { eager: true })
  @JoinTable()  // 다대다 관계를 위한 조인 테이블 설정
  members: User[];

  // 한 팀이 여러 경기 일정 get
  @OneToMany(() => TeamSchedule, (schedule) => schedule.team, { cascade: true })
  schedules: TeamSchedule[];

  // 팀원 조인 테이블 설정 (TeamMemberJoin 엔티티 사용)
  @OneToMany(() => TeamMemberJoin, (teamMemberJoin) => teamMemberJoin.team)
  teamMemberJoins: TeamMemberJoin[];

  // 추가된 부분: 팀 신고 관계
  @OneToMany(() => Report, (report) => report.reporterTeam, { cascade: true })
  reportsMade: Report[]; // 이 팀이 신고한 신고 목록

  @OneToMany(() => Report, (report) => report.reportedTeam, { cascade: true })
  reportsReceived: Report[]; // 이 팀이 신고받은 신고 목록
}
