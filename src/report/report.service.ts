import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { Team } from 'src/teams/entities/team.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
  ) {}

  async createReport(reporterTeamId: number, reportedTeamId: number, reason: string) {
    const reporterTeam = await this.teamRepo.findOne({ where: { team_id: reporterTeamId } });
    if (!reporterTeam) throw new Error('신고한 팀을 찾을 수 없습니다.');

    const reportedTeam = await this.teamRepo.findOne({ where: { team_id: reportedTeamId } });
    if (!reportedTeam) throw new Error('신고 대상 팀을 찾을 수 없습니다.');

    const report = this.reportRepo.create({
      reporterTeam: reporterTeam,
      reportedTeam: reportedTeam,
      reason,
    });

    return await this.reportRepo.save(report);
  }

  async getReports() {
    return await this.reportRepo.find({
      relations: ['reporter_team', 'reported_team'],
    });
  }

  async deleteReport(id: number) {
    return await this.reportRepo.delete(id);
  }
}
