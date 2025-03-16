import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Post } from './entities/post.entity';
import { TradePost } from './entities/trade-post.entity';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Post, TradePost,User])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
