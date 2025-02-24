import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../../users/entities/user.entity'; // User 엔터티 경로에 맞게 변경
import * as dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';

dotenv.config();
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
         // [3] Cookie에 있는 JWT 토큰을 추출
        super({
            secretOrKey: process.env.JWT_SECRET|| 'default-secret-key', // Secret Key 설정
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //Authorization 헤더에서 JWT 추출
        })
    } // [4] Secret Key로 검증 - 인스턴스 생성 자체가 Secret Key로 JWT 토큰 검증과정

    // [5] JWT에서 사용자 정보 가져오기(인증)
    async validate(payload) {
        const { email } = payload;

        const user: User = await this.usersService.findUserByEmail( email);

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}