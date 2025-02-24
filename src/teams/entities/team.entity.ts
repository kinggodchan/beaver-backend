import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { TeamMemberJoin } from './team-member-join.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  team_id: number;

  @Column({ length: 100 })
  team_name: string;

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

  @OneToMany(() => TeamMemberJoin, (teamMemberJoin) => teamMemberJoin.team)
  members: TeamMemberJoin[];
}
