import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateTeamRequestDto {
  @IsOptional()
  @IsString()
  team_name?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid URL format' })
  team_logo?: string; // S3 이미지 URL 업데이트 가능
}