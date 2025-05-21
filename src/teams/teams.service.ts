import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Team } from './entities/team.entity';
import { TeamMemberJoin } from 'src/team-member-join/entities/team-member-join.entity';
import { CreateTeamRequestDto } from './dto/create-team-request.dto';
import { UpdateTeamRequestDto } from './dto/update-team-request.dto';
import { User } from 'src/users/entities/user.entity';
import { JoinStatus } from 'src/team-member-join/entities/join-status.enum';
import { S3 } from 'aws-sdk';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);

  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(TeamMemberJoin)
    private teamMemberJoinRepository: Repository<TeamMemberJoin>,
  ) {}

  // 팀 생성
  async createTeam(
    logginedUser: User,
    createTeamRequestDto: CreateTeamRequestDto,
    image: Express.Multer.File,
  ): Promise<Team> {
    const { team_name, location, description } = createTeamRequestDto;

    let url: string | undefined;
    if (image) {
      const s3Bucket = process.env.AWS_S3_BUCKET as string;
      const s3Region = process.env.AWS_REGION as string;
      url = `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${(image as any).key}`;
    }

    const newTeam = this.teamsRepository.create({
      team_name,
      location,
      description,
      team_logo: url,
      captain: logginedUser,
    });

    await this.teamsRepository.save(newTeam);
    this.logger.verbose(`팀 생성 완료: ${newTeam.team_name}`);
    return newTeam;
  }

  // 모든 팀 조회
  async getAllTeams(): Promise<Team[]> {
    this.logger.verbose('모든 팀 조회 요청');
    const foundTeams = await this.teamsRepository.find();
    this.logger.verbose('모든 팀 조회 성공');
    return foundTeams;
  }

  // 팀 상세 조회 by id
  async getTeamDetailById(id: number): Promise<Team> {
    this.logger.verbose(`팀 상세 조회 요청 - ID: ${id}`);

    const foundTeam = await this.teamsRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.captain', 'captain')
      .where('team.team_id = :id', { id })
      .getOne();

    if (!foundTeam) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    this.logger.verbose(`팀 상세 조회 성공 - ID: ${id}`);
    return foundTeam;
  }

  // 팀 이름으로 검색
  async searchTeamsByName(name: string): Promise<Team[]> {
    this.logger.verbose(`팀 이름 검색 요청 - 이름: ${name}`);

    return await this.teamsRepository.find({
      where: { team_name: Like(`%${name}%`) },
      relations: ['captain'],
    });
  }

  // 팀 수정
  async updateTeam(
    id: number,
    updateTeamDto: UpdateTeamRequestDto,
    image: Express.Multer.File,
  ): Promise<void> {
    const team = await this.getTeamDetailById(id);

    if (team.team_logo && image) {
      const s3 = new S3();
      const s3Bucket = process.env.AWS_S3_BUCKET as string;
      const key = team.team_logo.split('.amazonaws.com/')[1];

      try {
        await s3
          .deleteObject({
            Bucket: s3Bucket,
            Key: key,
          })
          .promise();

        this.logger.verbose(`🗑️ 기존 이미지 삭제 완료: ${key}`);
      } catch (error) {
        this.logger.error(`❌ 기존 이미지 삭제 실패: ${error.message}`);
      }
    }

    if (image) {
      const s3Bucket = process.env.AWS_S3_BUCKET as string;
      const s3Region = process.env.AWS_REGION as string;
      const logoUrl = `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${(image as any).key}`;
      team.team_logo = logoUrl;
    }

    Object.assign(team, updateTeamDto);
    await this.teamsRepository.save(team);

    this.logger.verbose(`팀 수정 완료 - ID: ${id}`);
  }

  // 팀 삭제
  async removeTeam(id: number): Promise<void> {
    const team = await this.getTeamDetailById(id);
    await this.teamsRepository.remove(team);
    this.logger.verbose(`팀 삭제 완료 - ID: ${id}`);
  }

  // 특정 팀 멤버 조회
  async getTeamMembers(teamId: number): Promise<User[]> {
    const team = await this.teamsRepository.findOne({
      where: { team_id: teamId },
    });

    if (!team) {
      throw new NotFoundException('팀을 찾을 수 없습니다.');
    }

    const approvedMembers = await this.teamMemberJoinRepository
      .createQueryBuilder('join')
      .leftJoinAndSelect('join.user', 'user')
      .where('join.teamTeamId = :teamId', { teamId })
      .andWhere('join.status = :status', { status: JoinStatus.APPROVED })
      .getMany();

    this.logger.verbose(`팀 멤버 조회 성공 - 팀 ID: ${teamId}`);
    return approvedMembers.map((join) => join.user);
  }

  // 승수 순으로 팀 조회
  async getTeamsByWins(): Promise<Team[]> {
    return this.teamsRepository.find({
      order: { wins: 'DESC' },
      relations: ['captain'], // 필요하다면 다른 관계도 추가 가능
    });
  }

  // 승수 +1
  async incrementWins(id: number): Promise<void> {
    const team = await this.getTeamDetailById(id);
    team.wins += 1;
    await this.teamsRepository.save(team);
    this.logger.verbose(
      `승수 증가 완료 - 팀 ID: ${id}, 현재 승수: ${team.wins}`,
    );
  }

  // 랭킹 순
  async getAllTeamsOrderByRating(): Promise<Team[]> {
    return this.teamsRepository
      .createQueryBuilder('team')
      .orderBy('team.rating', 'DESC')
      .addOrderBy('team.wins', 'DESC')
      .addOrderBy('team.goals_for - team.goals_against', 'DESC')
      .getMany();
  }

  
}
