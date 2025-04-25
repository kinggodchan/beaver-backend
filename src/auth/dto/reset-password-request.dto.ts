import { IsString, MinLength } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
