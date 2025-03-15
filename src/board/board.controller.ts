import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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

  @Get()
  getAllBoards() {
    return this.boardService.getAllBoards();
  }

  @Get(':id')
  getBoard(@Param('id') id: number) {
    return this.boardService.getBoard(id);
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

  @Get('posts')
  getAllPosts() {
    return this.boardService.getAllPosts();
  }

  @Get('posts/:id')
  getPost(@Param('id') id: number) {
    return this.boardService.getPost(id);
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

  @Get('trade-posts')
  getAllTradePosts() {
    return this.boardService.getAllTradePosts();
  }

  @Get('trade-posts/:id')
  getTradePost(@Param('id') id: number) {
    return this.boardService.getTradePost(id);
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
