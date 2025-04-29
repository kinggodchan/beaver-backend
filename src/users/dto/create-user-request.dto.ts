import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { UserRole } from "../entities/user-role.enum";

export class CreateUserRequestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  // ✅ 대문자 필수 제거한 비밀번호 정규식
  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Password must include lowercase, number, and special character.' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  
  @Matches(/^01[016789]\d{7,8}$/, { message: 'Invalid Korean phone number format (e.g., 01012345678)' })
  phone_number?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
