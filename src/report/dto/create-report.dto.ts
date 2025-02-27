import { IsNotEmpty } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  reporterTeamId: number; // 신고한 팀 ID

  @IsNotEmpty()
  reportedTeamId: number; // 신고 대상 팀 ID

  @IsNotEmpty()
  reason: string; // 신고 사유
}
