import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { Inquiry } from './entities/inquiry.entity';

@Controller('inquiries')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  async create(@Body() dto: CreateInquiryDto): Promise<Inquiry> {
    return this.inquiryService.createInquiry(dto);
  }

  @Get()
  async getAll(): Promise<Inquiry[]> {
    return this.inquiryService.getAllInquiries();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<Inquiry | null> {
    return this.inquiryService.getInquiryById(id);
  }
}
