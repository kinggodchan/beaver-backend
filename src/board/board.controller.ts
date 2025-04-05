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

  /** 📌 모든 일반 게시글 조회 */
  @Get('posts')
  getAllPosts() {
    return this.boardService.getAllPosts();
  }

  /** 📌 특정 일반 게시글 조회 */
  @Get('posts/:id')
  getPost(@Param('id') id: number) {
    return this.boardService.getPost(id);
  }

  /** 📌 일반 게시글 생성 */
  @Post('posts')
  createPost(@Body() dto: CreatePostDto) {
    return this.boardService.createPost(dto);
  }

  /** 📌 일반 게시글 수정 */
  @Patch('posts/:id')
  updatePost(@Param('id') id: number, @Body() dto: UpdatePostDto) {
    return this.boardService.updatePost(id, dto);
  }

  /** 📌 일반 게시글 삭제 */
  @Delete('posts/:id')
  async deletePost(@Param('id') id: number) {
    return await this.boardService.deletePost(id);
  }

  /** 📌 모든 거래 게시글 조회 */
  @Get('trade-posts')
  getAllTradePosts() {
    return this.boardService.getAllTradePosts();
  }

  /** 📌 특정 거래 게시글 조회 */
  @Get('trade-posts/:id')
  getTradePost(@Param('id') id: string) {
    return this.boardService.getTradePost(Number(id)); 
  }
  

  /** 📌 거래 게시글 생성 */
  @Post('trade-posts')
  createTradePost(@Body() dto: CreateTradePostDto) {
    return this.boardService.createTradePost(dto);
  }

  /** 📌 거래 게시글 수정 */
  @Patch('trade-posts/:id')
  updateTradePost(@Param('id') id: number, @Body() dto: UpdateTradePostDto) {
    return this.boardService.updateTradePost(id, dto);
  }

  /** 📌 거래 게시글 삭제 */
  @Delete('trade-posts/:id')
  async deleteTradePost(@Param('id') id: number) {
    return await this.boardService.deleteTradePost(id);
  }

  /** 📌 게시판 생성 */
  @Post()
  createBoard(@Body() dto: CreateBoardDto) {
    return this.boardService.createBoard(dto);
  }

  /** 📌 모든 게시판 조회 */
  @Get()
  getAllBoards() {
    return this.boardService.getAllBoards();
  }

  /** 📌 특정 게시판 조회 */
  @Get(':id')
  getBoard(@Param('id') id: number) {
    return this.boardService.getBoard(id);
  }

  /** 📌 게시판 수정 */
  @Patch(':id')
  updateBoard(@Param('id') id: number, @Body() dto: UpdateBoardDto) {
    return this.boardService.updateBoard(id, dto);
  }

  /** 📌 게시판 삭제 */
  @Delete(':id')
  async deleteBoard(@Param('id') id: number) {
    return await this.boardService.deleteBoard(id);
  }
}
