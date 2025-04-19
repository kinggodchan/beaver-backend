import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTeamRequestDto } from './dto/create-team-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { In, Like, Repository } from 'typeorm';
import { UpdateTeamRequestDto } from './dto/update-team-request.dto';
import { User } from 'src/users/entities/user.entity';
import { TeamMemberJoin } from 'src/team-member-join/entities/team-member-join.entity';
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
    image: Express.Multer.File
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
    return newTeam
  }

  // 모든 팀 조회
  async getAllTeams(): Promise<Team[]> {
    this.logger.verbose(`Retrieving all Teams`);

    const foundTeams = await this.teamsRepository.find();

    this.logger.verbose(`Retrieved all Teams successfully`);
    return foundTeams;
  }

  // 팀 id로 조회
  async getTeamDetailById(id: number): Promise<Team> {
    this.logger.verbose(`Retrieving a team by id: ${id}`);
    const foundTeam = await this.teamsRepository
    .createQueryBuilder('team')
    .leftJoinAndSelect('team.captain', 'captain')
    .where('team.team_id = :id', { id })
    .getOne();
    
    if (!foundTeam) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    this.logger.verbose(`Retrieving a team by id${id} details Successfully ${foundTeam}`);
    return foundTeam;
  }
  
  // SEARCH TEAM by Name
  async searchTeamsByName(name: string): Promise<Team[]> {
    this.logger.verbose(`Searching teams by name: ${name}`);
  
    return await this.teamsRepository.find({
      where: { team_name: Like(`%${name}%`) },
      relations: ['captain'],
    });
  }
  // UPDATE TEAM
  async updateTeam(
    id: number,
    updateTeamDto: UpdateTeamRequestDto,
    image: Express.Multer.File,
  ): Promise<void> {
    const team = await this.getTeamDetailById(id);

  // 기존 이미지가 존재하고 새로운 이미지가 업로드되었을 경우
  if (team.team_logo && image) {
    const s3 = new S3();
    const s3Bucket = process.env.AWS_S3_BUCKET as string;
    const key = team.team_logo.split('.amazonaws.com/')[1]; // 기존 이미지 key 추출

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

  // 새로운 이미지가 업로드된 경우, URL 업데이트
  if (image) {
    const s3Bucket = process.env.AWS_S3_BUCKET as string;
    const s3Region = process.env.AWS_REGION as string;
    const logoUrl = `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${(image as any).key}`;
    team.team_logo = logoUrl;
  }

  Object.assign(team, updateTeamDto); // 텍스트 필드 업데이트

  await this.teamsRepository.save(team);
}

  // DELETE TEAM
  async removeTeam(id: number): Promise<void> {
    const team = await this.getTeamDetailById(id);
    await this.teamsRepository.remove(team);
  }


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
  
    return approvedMembers.map((join) => (join.user));
  }  
  
}
