import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamScheduleDto } from './create-team-schedule.dto';

export class UpdateTeamScheduleDto extends PartialType(CreateTeamScheduleDto) {}
