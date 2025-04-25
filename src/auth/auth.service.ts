import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserRequestDto } from 'src/users/dto/create-user-request.dto';
import { FindPasswordRequestDto } from './dto/find-password-request.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';


@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private jwtService: JwtService,
        private userService: UsersService,
    ){}

    // Sign-Up
    async signUp(createUserRequestDto: CreateUserRequestDto): Promise<void> {
        this.logger.verbose(`Visitor is creating a new account with title: ${createUserRequestDto.email}`);

        const { username, password, email, role, phone_number, location } = createUserRequestDto;
        if (!username || !password || !email || !role) {
            throw new BadRequestException('Something went wrong.');
        }

        await this.userService.checkEmailExist(email);

        const hashedPassword = await this.hashPassword(password);

        
        await this.userService.createUser({
            username, 
            password: hashedPassword,
            email,
            role,
            phone_number,
            location,
        });

        
        this.logger.verbose(`New account created Successfully`);
    }

    // Sign-In
// Sign-In
async signIn(signInRequestDto: SignInRequestDto): Promise<{ accessToken: string; user: any }> {
    this.logger.verbose(`User with email: ${signInRequestDto.email} is signing in`);
  
    const { email, password } = signInRequestDto;
  
    try {
      const existingUser = await this.userService.findUserByEmail(email);
  
      if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      // [1] JWT 토큰 생성
      const payload = {
        id: existingUser.user_id,
        email: existingUser.email,
        username: existingUser.username,
        role: existingUser.role,
      };
      const accessToken = await this.jwtService.sign(payload);
  
      this.logger.verbose(`User with email: ${signInRequestDto.email} issued JWT ${accessToken}`);
  
      // [2] user 객체에서 필요한 값만 추려서 보내기 (비밀번호 빼고)
      const user = {
        id: existingUser.user_id,
        email: existingUser.email,
        username: existingUser.username,
        role: existingUser.role,
        phone_number: existingUser.phone_number,
      };
  
      return { accessToken, user };
    } catch (error) {
      this.logger.error(`Invalid credentials or Internal Server error`);
      throw error;
    }
  }
  

    // Hashing password
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

    // 아이디(이메일) 기반으로 패스워드 재구성
    async findPassword(findPasswordDto: FindPasswordRequestDto): Promise<void> {
      const { email } = findPasswordDto;
      const user = await this.userService.findUserByEmail(email);
    
      if (!user) {
        throw new NotFoundException('User with this email not found.');
      }
    
      // 👉 여기서 진짜로 이메일 발송 기능이 있으면 추가
      this.logger.verbose(`Password reset email would be sent to: ${email}`);
    }
    
    async resetPassword(resetPasswordDto: ResetPasswordRequestDto): Promise<void> {
      const { email, newPassword } = resetPasswordDto;
      const user = await this.userService.findUserByEmail(email);
    
      if (!user) {
        throw new NotFoundException('User with this email not found.');
      }
    
      const hashedPassword = await this.hashPassword(newPassword);
      await this.userService.updatePassword(email, hashedPassword);
    
      this.logger.verbose(`Password reset successfully for: ${email}`);
    }   
}