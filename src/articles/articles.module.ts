import { Module } from '@nestjs/common';
import { ArticleController } from './articles.controller';
import { ArticleService } from './articles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Article } from './entities/article.entity';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Article]), 
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticlesModule {}
