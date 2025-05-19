import {Controller,Get,Post,Body,Patch,Param,Delete,HttpStatus,Logger,UseInterceptors,UploadedFile,UseGuards,ParseIntPipe,} from '@nestjs/common';
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
import { TeamRankingDto } from './dto/ranking.dto';

@Controller('api/teams')
export class TeamsController {
  private readonly logger = new Logger(TeamsController.name);

  constructor(private readonly teamsService: TeamsService) {}

  // 팀 생성
  @Post('/')
  @UseInterceptors(
    FileInterceptor(
      'image',
      multerOptionsFactory(new ConfigService(), 'team-logos'),
    ),
  )
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.USER)
  async createTeam(
    @GetUser() logginedUser: User,
    @Body() createTeamRequestDto: CreateTeamRequestDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ApiResponseDto<TeamResponseDto>> {
    this.logger.verbose(`팀 생성 요청: ${JSON.stringify(createTeamRequestDto)}`);

    const createdTeam = await this.teamsService.createTeam(
      logginedUser,
      createTeamRequestDto,
      image,
    );

    return new ApiResponseDto(
      true,
      HttpStatus.CREATED,
      '팀이 성공적으로 생성되었습니다.',
      new TeamResponseDto(createdTeam),
    );
  }

  // 팀 전체 조회
  @Get('/')
  async getAllTeams(): Promise<ApiResponseDto<TeamResponseDto[]>> {
    this.logger.verbose('모든 팀 조회 요청');

    const teams: Team[] = await this.teamsService.getAllTeams();
    const teamDtos = teams.map((team) => new TeamResponseDto(team));

    return new ApiResponseDto(
      true,
      HttpStatus.OK,
      '팀 목록 조회 성공',
      teamDtos,
    );
  }

  // 팀 상세 조회
  @Get('/:id/detail')
  async getTeamDetailById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<TeamResponseDto>> {
    this.logger.verbose(`팀 상세 조회 요청 - ID: ${id}`);

    const team = await this.teamsService.getTeamDetailById(id);

    return new ApiResponseDto(
      true,
      HttpStatus.OK,
      '팀 상세 조회 성공',
      new TeamResponseDto(team),
    );
  }

  // 팀 수정
  @Patch('/:id')
  @UseInterceptors(
    FileInterceptor(
      'image',
      multerOptionsFactory(new ConfigService(), 'team-logos'),
    ),
  )
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.USER)
  async updateTeam(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeamDto: UpdateTeamRequestDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ApiResponseDto<void>> {
    this.logger.verbose(`팀 수정 요청 - ID: ${id}`);

    await this.teamsService.updateTeam(id, updateTeamDto, image);

    return new ApiResponseDto(true, HttpStatus.OK, '팀 수정 성공');
  }

  // 팀 삭제
  @Delete('/:id')
  async removeTeam(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<void>> {
    this.logger.verbose(`팀 삭제 요청 - ID: ${id}`);

    await this.teamsService.removeTeam(id);

    return new ApiResponseDto(true, HttpStatus.OK, '팀 삭제 성공');
  }

  // 팀 이름으로 검색
  @Get('/search/:name')
  async searchTeamsByName(
    @Param('name') name: string,
  ): Promise<ApiResponseDto<TeamResponseDto[]>> {
    this.logger.verbose(`팀 이름 검색 요청 - 이름: ${name}`);

    const teams = await this.teamsService.searchTeamsByName(name);
    const teamDtos = teams.map((team) => new TeamResponseDto(team));

    return new ApiResponseDto(
      true,
      HttpStatus.OK,
      '팀 검색 성공',
      teamDtos,
    );
  }

  // 특정 팀의 멤버 조회
  @Get('/:teamId/members')
  async getTeamMembers(
    @Param('teamId', ParseIntPipe) teamId: number,
  ): Promise<ApiResponseDto<UserResponseDto[]>> {
    this.logger.verbose(`팀 멤버 조회 요청 - 팀 ID: ${teamId}`);

    const members: User[] = await this.teamsService.getTeamMembers(teamId);
    const memberDtos = members.map((member) => new UserResponseDto(member));

    return new ApiResponseDto(
      true,
      HttpStatus.OK,
      '팀 멤버 조회 성공',
      memberDtos,
    );
  }


  // 승수 순 추천 목록 조회
@Get('/recommend/by-wins')
async getTeamsByWins(): Promise<ApiResponseDto<TeamResponseDto[]>> {
  this.logger.verbose('승수 순 추천 목록 조회 요청');

  const teams = await this.teamsService.getTeamsByWins();
  const teamDtos = teams.map((team) => new TeamResponseDto(team));

  return new ApiResponseDto(
    true,
    HttpStatus.OK,
    '승수 순 추천 목록 조회 성공',
    teamDtos,
  );
}

  // 승수 +1
  @Patch('/:id/increment-wins')
  async incrementWins(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<void>> {
    this.logger.verbose(`승수 증가 요청 - 팀 ID: ${id}`);

    await this.teamsService.incrementWins(id);

    return new ApiResponseDto(true, HttpStatus.OK, '승수 증가 성공');
  }

  @Get('/:id/rating')
  async getTeamRatingById(
      @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponseDto<TeamRankingDto>> {
  
      const team = await this.teamsService.getTeamDetailById(id);
  
      return new ApiResponseDto(
        true,
        HttpStatus.OK,
        '팀 상세 조회 성공',
        new TeamRankingDto(team),
      );
    }

  // 전체 팀 순위 조회
  @Get('/rating')
  async getAllTeamsRating(): Promise<ApiResponseDto<TeamRankingDto[]>> {
    this.logger.verbose('모든 팀 조회 요청');

    const teams: Team[] = await this.teamsService.getAllTeams();
    const teamDtos = teams.map((team) => new TeamRankingDto(team));

    return new ApiResponseDto(
      true,
      HttpStatus.OK,
      '팀 목록 조회 성공',
      teamDtos,
    );
  }
}

