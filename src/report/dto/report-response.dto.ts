import { Expose } from 'class-transformer';

export class ReportResponseDto {
  @Expose()
  id: number;

  @Expose()
  reportedTeamId: number; // ✅ 신고 대상 팀 ID

  @Expose()
  reporterTeamId: number; // ✅ 신고한 팀 ID

  @Expose()
  reason: string;

  @Expose()
  createdAt: Date;
}
