import { Body, Controller, HttpStatus, Logger, Post,  Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';




@Controller('api/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(private authService: AuthService) {}



    //Sign -In 
    @Post('/signin')
    async signIn(@Body() signInRequestDto: SignInRequestDto, @Res() res:Response): Promise<void> {
        this.logger.verbose(`User with email: ${signInRequestDto.email} is try to signing in`);

        const accessToken = await this.authService.signIn(signInRequestDto);

        this.logger.verbose(`User with email: ${signInRequestDto.email} issued JWT ${accessToken}`);
        
            //[2] JWT를 쿠키 헤더에 저장
            res.setHeader('Authorization', accessToken);
            const response = new ApiResponseDto(true, HttpStatus.OK, 'User logged in successfully', { accessToken});

            res.send(response);
        }

}
