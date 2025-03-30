import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchResultService } from './match-result.service';
import { CreateMatchResultDto } from './dto/create-match-result.dto';
import { UpdateMatchResultDto } from './dto/update-match-result.dto';

@Controller('match-result')
export class MatchResultController {
  constructor(private readonly matchResultService: MatchResultService) {}

  @Post()
  create(@Body() createMatchResultDto: CreateMatchResultDto) {
    return this.matchResultService.create(createMatchResultDto);
  }

  @Get()
  findAll() {
    return this.matchResultService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchResultService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchResultDto: UpdateMatchResultDto) {
    return this.matchResultService.update(+id, updateMatchResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchResultService.remove(+id);
  }
}
