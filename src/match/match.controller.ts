import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/custom-guards-decorators/get-user.decorator';
import { MatchResponseDto } from './dto/match-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-guards-decorators/custom-role.guard';

@Controller('api/matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('/')
  @UseGuards(AuthGuard(), RolesGuard)
  async createMatch(
    @GetUser() user: User,
    @Body() createMatchDto: CreateMatchDto,
  ): Promise<ApiResponseDto<MatchResponseDto>> {
    const match = await this.matchService.createMatch(user, createMatchDto);
    return new ApiResponseDto(
      true,
      HttpStatus.CREATED,
      '경기 생성 완료',
      new MatchResponseDto(match),
    );
  }

  // match.controller.ts
  @Get('/')
  async getAllMatches(): Promise<ApiResponseDto<MatchResponseDto[]>> {
    const matches = await this.matchService.getAllMatches();
    const responseDtos = matches.map((match) => new MatchResponseDto(match));
    return new ApiResponseDto(
      true,
      HttpStatus.OK,
      '경기 전체 목록 조회 성공',
      responseDtos,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchService.update(+id, updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchService.remove(+id);
  }
}
