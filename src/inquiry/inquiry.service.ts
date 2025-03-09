import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { Inquiry } from './entities/inquiry.entity';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private inquiryRepository: Repository<Inquiry>,
  ) {}

  async createInquiry(dto: CreateInquiryDto): Promise<Inquiry> {
    const inquiry = this.inquiryRepository.create(dto);
    return await this.inquiryRepository.save(inquiry);
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return await this.inquiryRepository.find();
  }

  async getInquiryById(id: number): Promise<Inquiry | null> {
    return await this.inquiryRepository.findOne({ where: { inquiry_id: id } });
  }
}
