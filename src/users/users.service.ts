import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'
import { CreateUserRequestDto  } from './dto/create-user-request.dto';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
) {}
        // CREATE
        async createUser(createUserRequestDto: CreateUserRequestDto ): Promise<void> {
           this.logger.verbose(`Visitor is  creating a new account with title ${createUserRequestDto.email}`);
    
            const { username, password, email, role } = createUserRequestDto; 
            if (!username || !password || !email || !role) {
                    throw new BadRequestException('Something wnet wrong.');
            }
    
            //이메일 중복 확인
            await this.checkEmailExist(email);
    
                //비밀번호 해싱
                const hashedPassword = await this.hashPassword(password);
    
                const newUser = this.usersRepository.create({
                    id: 0,
                    username, 
                    password: hashedPassword,
                    email, 
                    role,
                });

                await this.usersRepository.save(newUser);

                
                this.logger.verbose(`New account eamil with ${newUser.email} created Successfully`);           
            }

            //READ - by Email
            async findUserByEmail(email : string): Promise<User> {
                const existingUser = await this.usersRepository.findOne({ where: { email }});
                if(!existingUser) {
                    throw new NotFoundException('User not found');
                }
                return existingUser; 
            }

            //Existing Checker
            async checkEmailExist(email: string): Promise<void> {
                        const existingUser = await this.usersRepository.findOne({where: { email } });
                        if(existingUser) {
                            throw new ConflictException('Email already exists');
                        } 
            }

            // Hashing Password
            async hashPassword(password: string): Promise<string> {
                        const salt = await bcrypt.genSalt();
                        return await bcrypt.hash(password, salt);
                    }
}
