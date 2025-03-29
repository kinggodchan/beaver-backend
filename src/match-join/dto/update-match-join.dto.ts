import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchJoinDto } from './create-match-join.dto';

export class UpdateMatchJoinDto extends PartialType(CreateMatchJoinDto) {}
