import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchJoinService } from './match-join.service';
import { CreateMatchJoinDto } from './dto/create-match-join.dto';
import { UpdateMatchJoinDto } from './dto/update-match-join.dto';

@Controller('match-join')
export class MatchJoinController {
  constructor(private readonly matchJoinService: MatchJoinService) {}

  @Post()
  create(@Body() createMatchJoinDto: CreateMatchJoinDto) {
    return this.matchJoinService.create(createMatchJoinDto);
  }

  @Get()
  findAll() {
    return this.matchJoinService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchJoinService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchJoinDto: UpdateMatchJoinDto) {
    return this.matchJoinService.update(+id, updateMatchJoinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchJoinService.remove(+id);
  }
}
