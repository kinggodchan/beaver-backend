import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateInquiryDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  reason: string;
}
