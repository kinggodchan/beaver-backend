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
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamRequestDto } from './dto/create-team-request.dto';
import { TeamResponseDto } from './dto/team-response.dto';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';
import { Team } from './entities/team.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateTeamRequestDto } from './dto/update-team-request.dto';
import { multerOptionsFactory } from 'src/configs/multer.options';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-guards-decorators/custom-role.guard';
import { Roles } from 'src/auth/custom-guards-decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user-role.enum';
import { GetUser } from 'src/auth/custom-guards-decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@Controller('api/teams')
export class TeamsController {
  private readonly logger = new Logger(TeamsController.name);

  constructor(private readonly teamsService: TeamsService) {}

  // CREATE TEAM
  @Post('/')
  @UseInterceptors(
    FileInterceptor('image', multerOptionsFactory(new ConfigService())),
  )
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.USER)
  async createTeam(
    @GetUser() logginedUser: User,
    @Body() createTeamRequestDto: CreateTeamRequestDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ApiResponseDto<void>> {
    this.logger.verbose(
      `Received data: ${JSON.stringify(createTeamRequestDto)}`,
    );
    if (!createTeamRequestDto) {
      this.logger.error('Request body is missing or invalid');
      throw new Error('Invalid request body');
    }
    await this.teamsService.createTeam(
      logginedUser,
      createTeamRequestDto,
      image,
    );

    this.logger.verbose(`Team title with created Successfully`);
    return new ApiResponseDto(
      true,
      HttpStatus.CREATED,
      'Team created Successfully',
    );
  }

  // READ all team
  @Get('/')
  async getAllTeams(): Promise<ApiResponseDto<TeamResponseDto[]>> {
    this.logger.verbose(`Try to Retrieving all Teams`);

    const teams: Team[] = await this.teamsService.getAllTeams();
    const teamsResponseDto = teams.map((team) => new TeamResponseDto(team));

    this.logger.verbose(`Retrieved all Articles successfully`);
    return new ApiResponseDto(
      true,
      HttpStatus.OK,
      'Team list retrive Successfully',
      teamsResponseDto,
    );
  }

  // READ - by id
  @Get('/:id/detail')
  async getTeamDetailById(
    @Param('id') id: number,
  ): Promise<ApiResponseDto<TeamResponseDto>> {
    this.logger.verbose(`Try to Retrieving a team by id: ${id}`);

    const teamResponseDto = new TeamResponseDto(
      await this.teamsService.getTeamDetailById(id),
    );

    this.logger.verbose(`Retrieving a team by id${id} details Successfully`);
    return new ApiResponseDto(
      true,
      HttpStatus.OK,
      'Team retrive Successfully',
      teamResponseDto,
    );
  }

  // UPDATE TEAM
  @Patch('/:id')
  @UseInterceptors(
    FileInterceptor('image', multerOptionsFactory(new ConfigService())),
  )
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.USER)
  async updateTeam(
    @Param('id') id: number,
    @Body() updateTeamDto: UpdateTeamRequestDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ApiResponseDto<void>> {
    await this.teamsService.updateTeam(id, updateTeamDto, image);
    return new ApiResponseDto(true, HttpStatus.OK, 'Team updated successfully');
  }

  // DELETE TEAM
  @Delete('/:id')
  async removeTeam(@Param('id') id: number): Promise<ApiResponseDto<void>> {
    await this.teamsService.removeTeam(id);
    return new ApiResponseDto(true, HttpStatus.OK, 'Team deleted successfully');
  }

  // SEARCH TEAMS BY NAME
  @Get('/search/:name')
  async searchTeamsByName(
    @Param('name') name: string,
  ): Promise<ApiResponseDto<TeamResponseDto[]>> {
    const teams = await this.teamsService.searchTeamsByName(name);
    const teamsResponseDto = teams.map((team) => new TeamResponseDto(team));
    return new ApiResponseDto(
      true,
      HttpStatus.OK,
      'Teams retrieved successfully',
      teamsResponseDto,
    );
  }

  // 팀 멤버 조회
  @Get(':teamId/members')
  async getTeamMembers(@Param('teamId', ParseIntPipe) teamId: number): Promise<ApiResponseDto<UserResponseDto[]>> {
    const members: User[] = await this.teamsService.getTeamMembers(teamId);
    const membersResponseDto = members.map((member) => new UserResponseDto(member));
    return new ApiResponseDto(
      true,
      HttpStatus.OK,
      'Teams retrieved successfully',
      membersResponseDto,
    );
  }
}
