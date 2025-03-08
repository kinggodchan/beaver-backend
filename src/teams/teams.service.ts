import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTeamRequestDto } from './dto/create-team-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';
import { TeamResponseDto } from './dto/team-response.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);

  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  // CREATE TEAM
  async createTeam(createTeamRequestDto: CreateTeamRequestDto): Promise<void> {
    const { team_name, location, description } =
      createTeamRequestDto;

    const newTeam = this.teamsRepository.create({
      team_name,
      location,
      description,
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

  async getTeamDetailById(id: number): Promise<Team> {
    this.logger.verbose(`Retrieving a team by id: ${id}`);
    const foundTeam = await this.teamsRepository.createQueryBuilder('team')
    .where('team.team_id = :id', { id })
    .getOne();

    if (!foundTeam) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    this.logger.verbose(`Retrieving a team by id${id} details Successfully`);
    return foundTeam;
  }

  // update(id: number, updateTeamDto: UpdateTeamDto) {
  //   return `This action updates a #${id} team`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} team`;
  // }
}
