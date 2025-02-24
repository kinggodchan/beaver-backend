import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { TradePost } from './entities/trade-post.entity';
import { CreateTradePostDto } from './dto/create-trade-post.dto';
import { UpdateTradePostDto } from './dto/update-trade-post.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepo: Repository<Board>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(TradePost) private tradePostRepo: Repository<TradePost>,
  ) {}

  /** 📌 게시판 생성 */
  async createBoard(dto: CreateBoardDto): Promise<Board> {
    const board = this.boardRepo.create(dto);
    return this.boardRepo.save(board);
  }

  /** 📌 게시판 수정 (예외 처리 추가) */
  async updateBoard(id: number, dto: UpdateBoardDto): Promise<Board> {
    const board = await this.boardRepo.findOne({ where: { board_id: id } });
  
    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
  
    Object.assign(board, dto); // 기존 값 덮어쓰기
    return this.boardRepo.save(board);
  }
  

  /** 📌 게시판 삭제 (예외 처리 추가) */
  async deleteBoard(id: number): Promise<void> {
    const result = await this.boardRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
  }

  /** 📌 일반 게시글 생성 */
  async createPost(dto: CreatePostDto): Promise<Post> {
    const post = this.postRepo.create(dto);
    return this.postRepo.save(post);
  }

  /** 📌 일반 게시글 수정 (예외 처리 추가) */
  async updatePost(id: number, dto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { post_id: id }, relations: ['board'] });
  
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  
    if (dto.board_id) {
      const board = await this.boardRepo.findOne({ where: { board_id: dto.board_id } });
      if (!board) {
        throw new NotFoundException(`Board with ID ${dto.board_id} not found`);
      }
      post.board = board;
    }
  
    Object.assign(post, dto);
    return this.postRepo.save(post);
  }

  /** 📌 일반 게시글 삭제 (예외 처리 추가) */
  async deletePost(id: number): Promise<void> {
    const result = await this.postRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }

  /** 📌 거래 게시글 생성 */
  async createTradePost(dto: CreateTradePostDto): Promise<TradePost> {
    const tradePost = this.tradePostRepo.create(dto);
    return this.tradePostRepo.save(tradePost);
  }

  /** 📌 거래 게시글 수정 (예외 처리 추가) */
  async updateTradePost(id: number, dto: UpdateTradePostDto): Promise<TradePost> {
    const tradePost = await this.tradePostRepo.findOne({ where: { trade_post_id: id }, relations: ['board'] });
  
    if (!tradePost) {
      throw new NotFoundException(`TradePost with ID ${id} not found`);
    }
  
    if (dto.board_id) {
      const board = await this.boardRepo.findOne({ where: { board_id: dto.board_id } });
      if (!board) {
        throw new NotFoundException(`Board with ID ${dto.board_id} not found`);
      }
      tradePost.board = board;
    }
  
    Object.assign(tradePost, dto);
    return this.tradePostRepo.save(tradePost);
  }
  

  /** 📌 거래 게시글 삭제 (예외 처리 추가) */
  async deleteTradePost(id: number): Promise<void> {
    const result = await this.tradePostRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TradePost with ID ${id} not found`);
    }
  }
}
