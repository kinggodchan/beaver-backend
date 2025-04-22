import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class FindEmailRequestDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsPhoneNumber('KR', { message: 'Invalid phone number format' })
  phone_number: string;
}
