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
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepo: Repository<Board>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(TradePost) private tradePostRepo: Repository<TradePost>,
    @InjectRepository(User) private userRepo: Repository<User>,
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
  async deleteBoard(id: number): Promise<{ message: string }> {
    const result = await this.boardRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Board with ID ${id} not found`);
    return { message: `Board with ID ${id} successfully deleted` };
  }

  /** 📌 모든 일반 게시글 조회 */
  async getAllPosts(): Promise<Post[]> {
    return this.postRepo.find({ relations: ['board'] });
  }

  /** 📌 특정 일반 게시글 조회 */
  async getPost(id: number): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { post_id: id },
      relations: ['board'],
    });
    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
    return post;
  }

  /** 📌 일반 게시글 생성 */
  async createPost(
    dto: CreatePostDto,
    file?: Express.Multer.File,
  ): Promise<Post> {
    const { boardId, title, content } = dto;

    // 📌 boardId가 실제 존재하는지 체크
    const board = await this.boardRepo.findOne({
      where: { board_id: boardId },
    });
    if (!board)
      throw new NotFoundException(`Board with ID ${boardId} not found`);

    let url: string | undefined;
    if (file) {
      const s3Bucket = process.env.AWS_S3_BUCKET as string;
      const s3Region = process.env.AWS_REGION as string;

      url = `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${(file as any).key}`;
    }

    // 📌 Post 엔티티 생성
    const post = this.postRepo.create({
      title,
      content,
      board, // ✅ board 객체를 직접 연결
      file: url,
    });

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
  async deletePost(id: number): Promise<{ message: string }> {
    const result = await this.postRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Post with ID ${id} not found`);
    return { message: `Post with ID ${id} successfully deleted` };
  }

  /** 📌 모든 거래 게시글 조회 */
  async getAllTradePosts(): Promise<TradePost[]> {
    return this.tradePostRepo.find({ relations: ['board'] });
  }

  /** 📌 특정 거래 게시글 조회 */
  async getTradePost(id: number): Promise<TradePost> {
    const tradePost = await this.tradePostRepo.findOne({
      where: { trade_post_id: id },
      relations: ['board'], // 🟢 board 정보 포함
    });

    if (!tradePost)
      throw new NotFoundException(`TradePost with ID ${id} not found`);

    return tradePost;
  }

  // 거래 게시글 생성
  async createTradePost(
    dto: CreateTradePostDto,
    file?: Express.Multer.File,
  ): Promise<TradePost> {
    const { boardId, authorId, title, content, price, tradeStatus } = dto;

    let url: string | undefined;
    if (file) {
      const s3Bucket = process.env.AWS_S3_BUCKET as string;
      const s3Region = process.env.AWS_REGION as string;

      url = `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${(file as any).key}`;
    }

    // 게시판 정보 가져오기
    const board = await this.getBoard(boardId);
    if (!board)
      throw new NotFoundException(`Board with ID ${boardId} not found`);

    // 사용자 정보 가져오기 (authorId -> author 객체로 변환)
    const author = await this.userRepo.findOne({
      where: { user_id: authorId },
    });
    if (!author)
      throw new NotFoundException(`User with ID ${authorId} not found`);

    // 새로운 거래 게시글 생성
    const tradePost = this.tradePostRepo.create({
      title,
      content,
      price,
      trade_status: tradeStatus,
      board,
      file: url,
      author, 
    });

    return this.tradePostRepo.save(tradePost);
  }

  // 거래 게시글 수정
  async updateTradePost(
    id: number,
    dto: UpdateTradePostDto,
  ): Promise<TradePost> {
    const tradePost = await this.getTradePost(id);

    if (dto.board_id) {
      const board = await this.getBoard(dto.board_id);
      tradePost.board = board;
    }

    Object.assign(tradePost, dto);
    return this.tradePostRepo.save(tradePost);
  }

  /** 📌 거래 게시글 삭제 */
  async deleteTradePost(id: number): Promise<{ message: string }> {
    const result = await this.tradePostRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`TradePost with ID ${id} not found`);
    return { message: `TradePost with ID ${id} successfully deleted` };
  }
}
