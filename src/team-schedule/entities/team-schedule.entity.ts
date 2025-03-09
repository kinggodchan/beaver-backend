import { Team } from 'src/teams/entities/team.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class TeamSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team, (team) => team.schedules, { onDelete: 'CASCADE' }) 
  team: Team; // 해당 일정이 속한 팀

  @Column({ type: 'datetime' })
  match_date: Date; // 경기 날짜

  @Column({ length: 255 })
  location: string; // 경기 장소

  @CreateDateColumn()
  created_at: Date; // 일정 생성일
}
