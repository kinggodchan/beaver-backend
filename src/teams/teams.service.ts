import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTeamRequestDto } from './dto/create-team-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Like, Repository } from 'typeorm';
import { UpdateTeamRequestDto } from './dto/update-team-request.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);

  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  // CREATE TEAM
  async createTeam(
    logginedUser: User,
    createTeamRequestDto: CreateTeamRequestDto,
    image: Express.Multer.File
  ): Promise<void> {
    this.logger.verbose(`Try to creating a new Team service`);
    const { team_name, location, description } = createTeamRequestDto;

    let logoUrl: string | undefined;
    if (image) {
      // S3의 key 값(image.key)을 사용하여 정확한 URL 생성
      const s3Bucket = process.env.AWS_S3_BUCKET as string;
      const s3Region = process.env.AWS_REGION as string;
      
      logoUrl = `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${(image as any).key}`;
      this.logger.debug(`✅ S3 File URL: ${logoUrl}`);
    }

    const newTeam = this.teamsRepository.create({
      team_name,
      location,
      description,
      team_logo: logoUrl,
      captain: logginedUser,
    });

    await this.teamsRepository.save(newTeam);
  }

  // READ ALL TEAMS
  async getAllTeams(): Promise<Team[]> {
    this.logger.verbose(`Retrieving all Teams`);

    const foundTeams = await this.teamsRepository.find();

    this.logger.verbose(`Retrieved all Teams successfully`);
    return foundTeams;
  }

  // READ - by ID
  async getTeamDetailById(id: number): Promise<Team> {
    this.logger.verbose(`Retrieving a team by id: ${id}`);
    const foundTeam = await this.teamsRepository
      .createQueryBuilder('team')
      .where('team.team_id = :id', { id })
      .getOne();

    if (!foundTeam) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    this.logger.verbose(`Retrieving a team by id${id} details Successfully`);
    return foundTeam;
  }

  // UPDATE TEAM
  async updateTeam(
    id: number,
    updateTeamDto: UpdateTeamRequestDto,
  ): Promise<void> {
    const team = await this.getTeamDetailById(id);

    Object.assign(team, updateTeamDto);

    await this.teamsRepository.save(team);
  }

  // DELETE TEAM
  async removeTeam(id: number): Promise<void> {
    const team = await this.getTeamDetailById(id);
    await this.teamsRepository.remove(team);
  }

  // SEARCH TEAM by Name
  async searchTeamsByName(name: string): Promise<Team[]> {
    this.logger.verbose(`Searching teams by name: ${name}`);

    return await this.teamsRepository.find({
      where: { team_name: Like(`%${name}%`) },
    });
  }
}
