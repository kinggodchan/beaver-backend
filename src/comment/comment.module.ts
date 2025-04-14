import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Post } from 'src/board/entities/post.entity';
import { TradePost } from 'src/board/entities/trade-post.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post, TradePost, User])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
