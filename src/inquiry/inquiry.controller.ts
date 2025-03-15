import { Controller, Get, Post, Body, Param, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { Inquiry } from './entities/inquiry.entity';

@Controller('inquiry')  // ← 변경: API 요청을 `/inquiry`로 받도록 수정
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  async create(@Body() dto: CreateInquiryDto): Promise<Inquiry> {
    try {
      return await this.inquiryService.createInquiry(dto);
    } catch (error) {
      throw new InternalServerErrorException('문의 등록 중 오류 발생');
    }
  }

  @Get()
  async getAll(): Promise<Inquiry[]> {
    try {
      return await this.inquiryService.getAllInquiries();
    } catch (error) {
      throw new InternalServerErrorException('문의 목록 조회 중 오류 발생');
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Inquiry> {
    try {
      const inquiry = await this.inquiryService.getInquiryById(+id);
      if (!inquiry) {
        throw new NotFoundException(`해당 ID(${id})의 문의를 찾을 수 없음`);
      }
      return inquiry;
    } catch (error) {
      throw new InternalServerErrorException('문의 조회 중 오류 발생');
    }
  }
}
