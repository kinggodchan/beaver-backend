import { Injectable, Logger } from '@nestjs/common';
import { CreateTeamRequestDto } from './dto/create-team-request.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);
  
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>
  ) {}

  // CREATE TEAM
  async createTeam(createTeamRequestDto: CreateTeamRequestDto): Promise<void>{
    const { team_name, location, description, team_logo, } = createTeamRequestDto;

    const newTeam = this.teamsRepository.create({
      team_name,
      location,
      description,
      team_logo,
    });
    
    await this.teamsRepository.save(newTeam);
  }

  // READ ALL TEAMS
  // async getAllTeams(): Promise<Team[]> {
  //   this.logger.verbose(`Retrieving all Teams`);

  //   const foundTeams = await this.teamsRepository.find();

  //   this.logger.verbose(`Retrieved all Teams successfully`);
  //   return foundTeams; 
  // }

  // async getTeamDetailById(id: number) {
  //   return `This action returns a #${id} team`;
  // }

  // update(id: number, updateTeamDto: UpdateTeamDto) {
  //   return `This action updates a #${id} team`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} team`;
  // }
}
