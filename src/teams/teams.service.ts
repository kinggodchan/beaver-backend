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

  async createTeam(createTeamRequestDto: CreateTeamRequestDto): Promise<void>{
    const { team_name, location } = createTeamRequestDto;

    const newTeam = this.teamsRepository.create({
      team_name,
      location,
    });
    
    await this.teamsRepository.save(newTeam);
  }

  // findAll() {
  //   return `This action returns all teams`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} team`;
  // }

  // update(id: number, updateTeamDto: UpdateTeamDto) {
  //   return `This action updates a #${id} team`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} team`;
  // }
}
