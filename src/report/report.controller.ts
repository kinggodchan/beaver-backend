import { Controller, Post, Get, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createReport(@Req() req: Request, @Body() dto: CreateReportDto) {
    return this.reportService.createReport(dto.reporterTeamId, dto.reportedTeamId, dto.reason);
  }

  @Get()
  getReports() {
    return this.reportService.getReports();
  }

  @Delete(':id')
  deleteReport(@Param('id') id: number) {
    return this.reportService.deleteReport(id);
  }
}
