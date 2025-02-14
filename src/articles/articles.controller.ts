import { Body, Controller,  Delete,  Get, HttpStatus, Logger, Param,  Patch,  Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ArticleService} from './articles.service';
import { Article} from './entites/article.entity';
import { CreateArticleRequestDto  } from './dto/create-article-request.dto';
import { ArticleStatus } from './entites/article-status.enum';
import { UpdateArticleRequestDto  } from './dto/update-article-request.dto';
import { ArticleStatusValidationPipe } from '../common/pipes/article-status-validation.pipe';
import {ArticleResponseDto} from './dto/article-response.dto';
import { SearchArticleResponseDto  } from './dto/search-article-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-guards-decorators/custom-role.guard';
import { Roles } from 'src/auth/custom-guards-decorators/roles.decorator';
import { GetUser } from 'src/auth/custom-guards-decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/entities/user-role.enum';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';

@Controller('api/articles')
@UseGuards(AuthGuard(), RolesGuard)
export class ArticleController {
    private readonly logger = new Logger(ArticleController.name);

    constructor(private articleService: ArticleService){}


    //CREATE
     @Post('/')
     async createArticle(@Body() createArticleRequestDto: CreateArticleRequestDto , 
     @GetUser() logginedUser : User): Promise<ApiResponseDto<void>> {
        this.logger.verbose(`User: ${logginedUser.username} is try to creating a new article with title: ${createArticleRequestDto.title}`);

        await this.articleService.createArticle(createArticleRequestDto, logginedUser)

        this.logger.verbose(`Article title with created Successfully`);
        return new ApiResponseDto(true, HttpStatus.CREATED, 'Article created Successfully');
    }

    //READ - all
    @Get('/')
    @Roles(UserRole.USER) //로그인유저가 USER만 접근 가능
    async getAllArticle(): Promise<ApiResponseDto<ArticleResponseDto[]>> {
        this.logger.verbose(`Try to Retrieving all Articles`);

        const articles: Article[] = await this.articleService.getAllArticles();
        const articlesResponseDto = articles.map(article => new ArticleResponseDto(article));

        this.logger.verbose(`Retrieved all Articles successfully`);
        return new ApiResponseDto(true , HttpStatus.OK , 'Article list retrive Successfully',articlesResponseDto);
    }
    
    //READ - by Loggined User
     @Get('/myarticles')
    async getMyAllArticles(@GetUser() logginedUser: User): Promise<ApiResponseDto<ArticleResponseDto[]>> {
        this.logger.verbose(`Try to Retrieving ${logginedUser.username}'s all Articles`);

        const articles: Article[] = await this.articleService.getMyAllArticles(logginedUser);
        const articlesResponseDto = articles.map(article => new ArticleResponseDto(article));

        this.logger.verbose(`Retrieving ${logginedUser.username}'s all Articles Successfully`);
        return new ApiResponseDto(true, HttpStatus.OK, 'Article list retrive Successfully',articlesResponseDto);
    }

    // READ - by id
    @Get('/:id/detail')
    async getArticleDetailById(@Param('id') id: number):Promise<ApiResponseDto<ArticleResponseDto>> {
        this.logger.verbose(`Try to Retrieving a article by id: ${id}`);

        const articleResponseDto = new ArticleResponseDto(await this.articleService.getArticleDetailById(id));
        
        this.logger.verbose(`Retrieving a article by id${id} details Successfully`);
        return new ApiResponseDto(true, HttpStatus.OK, 'Article retrive Successfully',articleResponseDto);
    }

    
    // READ - by keyword
    @Get('/search')
    async getArticlesByKeyword(@Query('keyword') author: string): Promise<ApiResponseDto<SearchArticleResponseDto[]>>  {
        this.logger.verbose(`Try to Retrieving a article by author: ${author}`);

       const articles: Article[] = await this.articleService.getArticlesByKeyword(author);
       const articlesResponseDto = articles.map(article => new SearchArticleResponseDto (article)); 

        this.logger.verbose(`Retrieved  articles  list by ${author} Successfully `);
        return new ApiResponseDto(true, HttpStatus.OK, 'Article list retrive Successfuuly', articlesResponseDto);
    }

    // UPDATE - by id
    @Put('/:id')
    async updateArticleById(
        @Param('id') id: number, 
        @Body() updateArticleRequestDto  : UpdateArticleRequestDto  ): Promise<ApiResponseDto<void>> {
        this.logger.verbose(`ADMIN is trying to Updating  a article by id: ${id} with updateArticleRequestDto  `);

        await this.articleService.updateArticleById(id, updateArticleRequestDto)

        this.logger.verbose(`Updated a article by ${id} Successfully`);
        return new ApiResponseDto(true, HttpStatus.NO_CONTENT, 'Article update Successfully');
    }

    //UPDATE - by status <ADMIN>
    @Patch('/:id')
    @Roles(UserRole.ADMIN)
    async updateArticleStatusById(
        @Param('id') id: number, 
        @Body('status', ArticleStatusValidationPipe) status: ArticleStatus ): Promise<ApiResponseDto<void>> {
        this.logger.verbose(`ADMIN is Updating  a article by id: ${id} with status: ${status}`);

        await this.articleService.updateArticleStatusById(id,status);

        this.logger.verbose(`ADMIN Updated a article's byby ${id} status to ${status}  Successfully`);
        return new ApiResponseDto(true, HttpStatus.NO_CONTENT,'Article status changed Successfully');
    }

    //DELETE - by id
    @Delete('/:id')
    @Roles( UserRole.USER, UserRole.ADMIN) 
    async deleteArticleById(@Param('id') id: number, @GetUser() loggindeUser: User): Promise<ApiResponseDto<void>> {
        this.logger.verbose(`User: ${loggindeUser. username} is tryying to Deletng a article by id :${id}`);

        await this.articleService.deleteArticleById(id, loggindeUser);

        this.logger.verbose(`Deleted a article by id : ${id} Successfully`);
        return new ApiResponseDto(true, HttpStatus.NO_CONTENT, 'Article delete Successfully');
    }
}
