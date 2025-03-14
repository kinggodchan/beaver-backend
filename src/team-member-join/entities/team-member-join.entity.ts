import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { JoinStatus } from './join-status.enum';
import { Team } from 'src/teams/entities/team.entity';


@Entity()
export class TeamMemberJoin {
  @PrimaryGeneratedColumn()
  participation_id: number;

  @ManyToOne(() => Team, (team) => team.members, { onDelete: 'CASCADE' })
  team: Team;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: 'Pending' })
  status: JoinStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  modified_at: Date;
}
