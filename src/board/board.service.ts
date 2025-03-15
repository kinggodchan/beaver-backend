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

  /** 📌 모든 게시판 조회 */
  async getAllBoards(): Promise<Board[]> {
    return this.boardRepo.find();
  }

  /** 📌 특정 게시판 조회 */
  async getBoard(id: number): Promise<Board> {
    const board = await this.boardRepo.findOne({ where: { board_id: id } });
    if (!board) throw new NotFoundException(`Board with ID ${id} not found`);
    return board;
  }

  /** 📌 게시판 생성 */
  async createBoard(dto: CreateBoardDto): Promise<Board> {
    const board = this.boardRepo.create(dto);
    return this.boardRepo.save(board);
  }

  /** 📌 게시판 수정 */
  async updateBoard(id: number, dto: UpdateBoardDto): Promise<Board> {
    const board = await this.getBoard(id);
    Object.assign(board, dto);
    return this.boardRepo.save(board);
  }

  /** 📌 게시판 삭제 */
  async deleteBoard(id: number): Promise<void> {
    const result = await this.boardRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Board with ID ${id} not found`);
  }

  /** 📌 모든 일반 게시글 조회 */
  async getAllPosts(): Promise<Post[]> {
    return this.postRepo.find({ relations: ['board'] });
  }

  /** 📌 특정 일반 게시글 조회 */
  async getPost(id: number): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { post_id: id }, relations: ['board'] });
    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
    return post;
  }

  /** 📌 일반 게시글 생성 */
  async createPost(dto: CreatePostDto): Promise<Post> {
    const post = this.postRepo.create(dto);
    return this.postRepo.save(post);
  }

  /** 📌 일반 게시글 수정 */
  async updatePost(id: number, dto: UpdatePostDto): Promise<Post> {
    const post = await this.getPost(id);

    if (dto.board_id) {
      const board = await this.getBoard(dto.board_id);
      post.board = board;
    }

    Object.assign(post, dto);
    return this.postRepo.save(post);
  }

  /** 📌 일반 게시글 삭제 */
  async deletePost(id: number): Promise<void> {
    const result = await this.postRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Post with ID ${id} not found`);
  }

  /** 📌 모든 거래 게시글 조회 */
  async getAllTradePosts(): Promise<TradePost[]> {
    return this.tradePostRepo.find({ relations: ['board'] });
  }

  /** 📌 특정 거래 게시글 조회 */
  async getTradePost(id: number): Promise<TradePost> {
    const tradePost = await this.tradePostRepo.findOne({ where: { trade_post_id: id }, relations: ['board'] });
    if (!tradePost) throw new NotFoundException(`TradePost with ID ${id} not found`);
    return tradePost;
  }

  /** 📌 거래 게시글 생성 */
  async createTradePost(dto: CreateTradePostDto): Promise<TradePost> {
    const tradePost = this.tradePostRepo.create(dto);
    return this.tradePostRepo.save(tradePost);
  }

  /** 📌 거래 게시글 수정 */
  async updateTradePost(id: number, dto: UpdateTradePostDto): Promise<TradePost> {
    const tradePost = await this.getTradePost(id);

    if (dto.board_id) {
      const board = await this.getBoard(dto.board_id);
      tradePost.board = board;
    }

    Object.assign(tradePost, dto);
    return this.tradePostRepo.save(tradePost);
  }

  /** 📌 거래 게시글 삭제 */
  async deleteTradePost(id: number): Promise<void> {
    const result = await this.tradePostRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`TradePost with ID ${id} not found`);
  }
}
