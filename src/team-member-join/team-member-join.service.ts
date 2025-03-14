import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamMemberJoin } from './entities/team-member-join.entity';
import { Repository } from 'typeorm';
import { Team } from 'src/teams/entities/team.entity';
import { User } from 'src/users/entities/user.entity';
import { JoinStatus } from './entities/join-status.enum';

@Injectable()
export class TeamMemberJoinService {
  constructor(
    @InjectRepository(TeamMemberJoin)
    private teamMemberJoinRepository: Repository<TeamMemberJoin>,

    @InjectRepository(Team)
    private teamRepository: Repository<Team>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 참가 신청
  async requestJoinTeam(teamId: number, userId: number): Promise<void> {
    const team = await this.teamRepository.findOneBy({ team_id: teamId });
    if (!team) throw new NotFoundException('팀을 찾을 수 없습니다.');

    const user = await this.userRepository.findOneBy({ user_id: userId });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    const existingRequest = await this.teamMemberJoinRepository.findOne({
      where: { team, user },
    });

    if (existingRequest) {
      throw new ConflictException('이미 참가 신청을 했습니다.');
    }

    const joinRequest = this.teamMemberJoinRepository.create({
      team,
      user,
      status: JoinStatus.PENDING,
    });

    await this.teamMemberJoinRepository.save(joinRequest);
  }
}
