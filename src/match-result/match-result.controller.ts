import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { MatchResultService } from './match-result.service';
import { CreateMatchResultDto } from './dto/create-match-result.dto';
import { UpdateMatchResultDto } from './dto/update-match-result.dto';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';
import { GetUser } from 'src/auth/custom-guards-decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-guards-decorators/custom-role.guard';
import { UserRole } from 'src/users/entities/user-role.enum';
import { Roles } from 'src/auth/custom-guards-decorators/roles.decorator';
import { MatchResult } from './entities/match-result.entity';
import { MatchResultResponseDto } from './dto/match-result-response.dto';

@Controller('api/matches')
export class MatchResultController {
  constructor(private readonly matchResultService: MatchResultService) {}

  @Post('/:matchId/result')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.USER)
  async createResult(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Body() dto: CreateMatchResultDto,
    @GetUser() user: User,
  ): Promise<ApiResponseDto<void>> {
    await this.matchResultService.createResult(matchId, dto, user);
    return new ApiResponseDto(true, HttpStatus.OK, '경기 결과 저장 완료');
  }

  // match-result.controller.ts
  @Get('/:matchId/result')
  async getResult(
    @Param('matchId', ParseIntPipe) matchId: number,
  ): Promise<ApiResponseDto<MatchResultResponseDto>> {
    const result = new MatchResultResponseDto(
      await this.matchResultService.getResultByMatchId(matchId),
    );
    return new ApiResponseDto(true, HttpStatus.OK, '경기 결과 조회 성공', result);
  }

  @Patch('/:matchId/result')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.USER)
  async updateResult(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Body() dto: UpdateMatchResultDto,
    @GetUser() user: User,
  ): Promise<ApiResponseDto<void>> {
    await this.matchResultService.updateMatchResult(matchId, dto, user);
    return new ApiResponseDto(true, HttpStatus.OK, '경기 결과 수정 완료');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchResultService.remove(+id);
  }
}
