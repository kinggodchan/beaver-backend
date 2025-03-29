import { Injectable } from '@nestjs/common';
import { CreateMatchJoinDto } from './dto/create-match-join.dto';
import { UpdateMatchJoinDto } from './dto/update-match-join.dto';

@Injectable()
export class MatchJoinService {
  create(createMatchJoinDto: CreateMatchJoinDto) {
    return 'This action adds a new matchJoin';
  }

  findAll() {
    return `This action returns all matchJoin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} matchJoin`;
  }

  update(id: number, updateMatchJoinDto: UpdateMatchJoinDto) {
    return `This action updates a #${id} matchJoin`;
  }

  remove(id: number) {
    return `This action removes a #${id} matchJoin`;
  }
}
