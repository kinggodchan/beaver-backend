import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateTradePostDto } from './dto/create-trade-post.dto';
import { UpdateTradePostDto } from './dto/update-trade-post.dto';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  createBoard(@Body() dto: CreateBoardDto) {
    return this.boardService.createBoard(dto);
  }

  @Patch(':id')
  updateBoard(@Param('id') id: number, @Body() dto: UpdateBoardDto) {
    return this.boardService.updateBoard(id, dto);
  }

  @Delete(':id')
  deleteBoard(@Param('id') id: number) {
    return this.boardService.deleteBoard(id);
  }

  @Post('posts')
  createPost(@Body() dto: CreatePostDto) {
    return this.boardService.createPost(dto);
  }

  @Patch('posts/:id')
  updatePost(@Param('id') id: number, @Body() dto: UpdatePostDto) {
    return this.boardService.updatePost(id, dto);
  }

  @Delete('posts/:id')
  deletePost(@Param('id') id: number) {
    return this.boardService.deletePost(id);
  }

  @Post('trade-posts')
  createTradePost(@Body() dto: CreateTradePostDto) {
    return this.boardService.createTradePost(dto);
  }

  @Patch('trade-posts/:id')
  updateTradePost(@Param('id') id: number, @Body() dto: UpdateTradePostDto) {
    return this.boardService.updateTradePost(id, dto);
  }

  @Delete('trade-posts/:id')
  deleteTradePost(@Param('id') id: number) {
    return this.boardService.deleteTradePost(id);
  }
}
