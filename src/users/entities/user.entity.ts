import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.enum';
import { Team } from 'src/teams/entities/team.entity'; // 팀 엔티티 추가
import { Comment } from 'src/comment/entities/comment.entity';
import { TradePost } from 'src/board/entities/trade-post.entity';
import { TeamMemberJoin } from 'src/team-member-join/entities/team-member-join.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 20 })
  phone_number: string;

  @Column({ length: 255, nullable: true })
  location?: string;

  @Column()
  role: UserRole;

  @ManyToMany(() => Team, (team) => team.members)
  teams: Team[]; // 유저가 여러 팀에 속할 수 있음
  
  @OneToMany(() => Comment, (comment) => comment.author, { cascade: true })
  comments: Comment[];

  @OneToMany(() => TradePost, (tradePost) => tradePost.author, {
    cascade: true,
  })
  tradePosts: TradePost[];

  // 여러팀에 가입 신청을 할 수 있다.
  @OneToMany(() => TeamMemberJoin, (teamMemberJoin) => teamMemberJoin.user)
  joinRequests: TeamMemberJoin[];

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;
}
