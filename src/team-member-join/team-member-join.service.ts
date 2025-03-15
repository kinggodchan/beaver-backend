import {
  ConflictException,
  ForbiddenException,
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

  // 팀 정보 조회
  async getTeamById(id: number): Promise<Team> {
    const foundTeam = await this.teamRepository
      .createQueryBuilder('team')
      .where('team.team_id = :id', { id })
      .getOne();

    if (!foundTeam) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return foundTeam;
  }

  async getUserById(id: number): Promise<User> {
    const foundUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.user_id = :id', { id })
      .getOne();

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return foundUser;
  }
  // 참가 신청
  async requestJoinTeam(teamId: number, userId: number): Promise<void> {
    const team = await this.getTeamById(teamId);

    const user = await this.getUserById(userId);

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

  // 팀장이 참가 신청을 승인 / 거절
  async updateJoinStatus(
    teamId: number,
    joinId: number,
    userId: number,
    status: JoinStatus,
  ): Promise<void> {
    const team = await this.teamRepository.findOne({
      where: { team_id: teamId },
    });

    if (!team) throw new NotFoundException('팀을 찾을 수 없습니다.');

    if (team.captain.user_id !== userId) {
      throw new ForbiddenException('팀장만 승인/거절할 수 있습니다.');
    }

    const joinRequest = await this.teamMemberJoinRepository.findOne({
      where: { join_id: joinId },
    });

    if (!joinRequest)
      throw new NotFoundException('참가 신청을 찾을 수 없습니다.');

    joinRequest.status = status;
    await this.teamMemberJoinRepository.save(joinRequest);

    if (status === JoinStatus.APPROVED) {
      team.members.push(joinRequest);
      await this.teamRepository.save(team);
    }
  }

  // 참가 신청 목록 조회 (팀장이 확인하는 부분)
  async getJoinRequests(
    teamId: number,
    logginedUser: User,
  ): Promise<TeamMemberJoin[]> {
    const team = await this.teamRepository
    .createQueryBuilder('team')
    .where('team.team_id = :teamId', { teamId })
    .leftJoinAndSelect('team.captain', 'captain')
    .getOne();
    
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    
    // 팀장 권한 확인
    if (team.captain.user_id !== logginedUser.user_id) {
      throw new ForbiddenException('You are not the team leader');
    }

    // 팀의 참가 신청 목록 조회
    const joinRequests = await this.teamMemberJoinRepository
      .createQueryBuilder('join')
      .where('join.teamTeamId = :teamId', { teamId })
      .leftJoinAndSelect('join.user', 'user') // 참가 신청자 정보도 함께 가져오기
      .select([
        'join.join_id',
        'join.status',
        'join.created_at',
        'user.user_id',
        'user.username',
        'user.email',
      ])
      .orderBy('join.created_at', 'DESC')
      .getMany();

    return joinRequests;
  }
}
