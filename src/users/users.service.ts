import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserRequestDto  } from './dto/create-user-request.dto';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    // CREATE - User
    async createUser(createUserRequestDto: CreateUserRequestDto): Promise<void> {
        const { username, password, email, role, phone_number } = createUserRequestDto;

        const newUser = this.usersRepository.create({
            username,
            password,
            email,
            role,
            phone_number,
        });

        await this.usersRepository.save(newUser);
    }

    // READ - by email
    async findUserByEmail(email: string): Promise<User> {
        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if(!existingUser) {
            throw new NotFoundException('User not found');
        }
        return existingUser;
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find(); // 모든 사용자 반환
    }

    // Existing Checker
        async checkEmailExist(email: string): Promise<void> {
            const existingUser = await this.usersRepository.findOne({ where: { email } });
            if(existingUser) {
                throw new ConflictException('Email already exists');
            }
    }
}
