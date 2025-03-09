import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../../users/entities/user.entity'; // User 엔터티 경로에 맞게 변경
import * as dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

dotenv.config();
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService, //ConfigService 주입
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret-key', // ✅ 환경 변수에서 JWT_SECRET 가져오기
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization 헤더에서 JWT 추출
    });
  }

  async validate(payload: any) {
    const { email } = payload;
    const user: User = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('인증 실패: 사용자를 찾을 수 없습니다.');
    }

    return user;
  }
}