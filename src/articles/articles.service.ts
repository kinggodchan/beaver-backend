import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Article } from './entities/article.entity';
import { CreateArticleRequestDto } from './dto/create-article-request.dto';
import { ArticleStatus } from './entities/article-status.enum';
import { UpdateArticleRequestDto } from './dto/update-article-request.dto';


@Injectable()
export class ArticleService {
    private readonly logger = new Logger(ArticleService.name);

    constructor(
        @InjectRepository(Article)
        private articleRepository: Repository<Article>
    ) {}


    // CREATE
    async createArticle(createArticleRequestDto: CreateArticleRequestDto, logginedUser: User): Promise<void> {
        this.logger.verbose(`User ${logginedUser.username} is creating a new article with title: ${createArticleRequestDto.title}`);

        const { title, contents } = createArticleRequestDto; 
        if ( !title || !contents) {
            this.logger.error(`Title, and contents must be porvided`);
            throw new BadRequestException('Title, and contents must be provided');
        }
        const newArticle: Article = this. articleRepository.create({
            author: logginedUser.username,
            title,
            contents, 
            status: ArticleStatus.PUBLIC,
            user:logginedUser
        });

        await this.articleRepository.save(newArticle);
        
        this.logger.verbose(`Article title with ${newArticle.title}  created Successfully`);
    }

    //READ - all
    async getAllArticles(): Promise<Article[]> {
        this.logger.verbose(`Retrieving all Articles`);

        const foundArticles = await this.articleRepository.find();

        this.logger.verbose(`Retrieved all Articles successfully`);
        return foundArticles; 
    }


    //READ - by Loggined User
    async getMyAllArticles(logginedUser: User): Promise<Article[]> {
        this.logger.verbose(`Retrieving ${logginedUser.username}'s all Articles`);

        const foundArticles = await this.articleRepository.createQueryBuilder('article')
        .leftJoinAndSelect('article.user', 'user') 
        .where('article.userId = :userId', { userId: logginedUser.id})
        .getMany();

        this.logger.verbose(`Retrieving ${logginedUser.username}'s all Articles Successfully`);

        return foundArticles; 
    }    

    //READ - by id
    async getArticleDetailById(id: number): Promise<Article> {
        this.logger.verbose(`Retrieving a article by id: ${id}`);

        const foundArticle = await this.articleRepository.createQueryBuilder('article')
            .leftJoinAndSelect('article.user', 'user') 
            .where('article.id = :id', { id })
            .getOne();

        if (!foundArticle) {
            throw new NotFoundException(`Article with ID ${id} not found`);
        }

        this.logger.verbose(`Retrieving a article by id${id} details Successfully`);
        return foundArticle;
    }
    


    // READ - by keyword
    async getArticlesByKeyword(author: string): Promise<Article[]>{
        this.logger.verbose(`Retrieving a article by author: ${author}`);
        if(!author) {
            throw new BadRequestException('Author keyword must be porvided');
        }

        const foundArticles = await this.articleRepository.findBy({ author: author})
        if (foundArticles.length === 0)  {
            throw new NotFoundException('No articles found for author: ${author}');
        }

       this.logger.verbose(`Retrieved  articles list by ${author} Successfully `);
        return foundArticles;
    }


    //UPDATE - by id
    async updateArticleById(id:number, updateArticleRequestDto:UpdateArticleRequestDto): Promise<void> {
        this.logger.verbose(`Updating  a article by id: ${id} with updateArticleRequestDto`);

        const foundArticle = await this.getArticleDetailById(id);
        const { title,contents} = updateArticleRequestDto;
        if(!title || !contents) {
            throw new BadRequestException('Title and contents must be provided');
        }
        foundArticle.title = title;
        foundArticle.contents = contents;
        await this.articleRepository.save(foundArticle)

        this.logger.verbose(`Updated a article by ${id} Successfully`);
    }


    // UPDATE - by status <ADMIN>
    async updateArticleStatusById(id: number, status: ArticleStatus): Promise<void> {
        this.logger.verbose(`ADMIN is Updating  a article by id: ${id} with status: ${status}`);

        const reuslt = await this.articleRepository.update(id , {status});
        if(reuslt.affected === 0) {
            throw new NotFoundException('Article with ID ${id} not found');
        }
        
        this.logger.verbose(`ADMIN Updated a article's byby ${id} status to ${status}  Successfully`);
    }  

    // DELETE - by id
    async deleteArticleById(id: number, loggindeUser:User):Promise<void> {
        this.logger.verbose(`User: ${loggindeUser. username} is Deletng a article by id :${id}`);

        const foundArticle = await this.getArticleDetailById(id);
        // 작성자와 요청한 사용자가 같은지 확인
        if(foundArticle.user.id !== loggindeUser.id) {
            throw new UnauthorizedException('Do not have permission th delete this article')
        }
        await this.articleRepository.delete(foundArticle);
        this.logger.verbose(`Deleted a article by id : ${id} Successfully`);
    }
}