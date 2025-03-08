import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamRequestDto } from './dto/create-team-request.dto';
import { TeamResponseDto } from './dto/team-response.dto';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';
import { Team } from './entities/team.entity';

@Controller('api/teams')
export class TeamsController {
  private readonly logger = new Logger(TeamsController.name);

  constructor(private readonly teamsService: TeamsService) {}

  // CREATE TEAM
  @Post('/')
  async createTeam(
    @Body() createTeamRequestDto: CreateTeamRequestDto,
  ): Promise<ApiResponseDto<void>> {
    // this.logger.verbose(`User: ${logginedUser.username} is try to creating a new team with title: ${createTeamRequestDto.title}`);
    this.logger.verbose(`Try to creating a new Team`);

    await this.teamsService.createTeam(createTeamRequestDto);

    this.logger.verbose(`Team title with created Successfully`);
    return new ApiResponseDto(
      true,
      HttpStatus.CREATED,
      'Team created Successfully',
    );
    // return this.teamsService.createTeam(createTeamRequestDto);
  }

  @Get('/')
  async getAllTeams(): Promise<ApiResponseDto<TeamResponseDto[]>> {
    this.logger.verbose(`Try to Retrieving all Teams`);

    const teams: Team[] = await this.teamsService.getAllTeams();
    const teamsResponseDto = teams.map((team) => new TeamResponseDto(team));

    this.logger.verbose(`Retrieved all Articles successfully`);
    return new ApiResponseDto(true, HttpStatus.OK, 'Team list retrive Successfully', teamsResponseDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.teamsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
  //   return this.teamsService.update(+id, updateTeamDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.teamsService.remove(+id);
  // }
}
