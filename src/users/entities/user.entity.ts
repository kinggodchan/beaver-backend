import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { UserRole } from "./user-role.enum";
import { Article } from "src/articles/entities/article.entity";
import { Comment } from "src/comment/entities/comment.entity";
import { UserLevel } from "./user-level.enum";
import { TradePost } from "src/board/entities/trade-post.entity";
import { Report } from "src/report/entities/report.entity";
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    user_id: number;
  
    @Column()
    username: string;
  
    @Column()
    password: string;
  
    @Column({ unique: true }) 
    email: string;
  
    @Column({ length: 20, nullable: false })
    phone_number: string;
  
    @Column({ length: 255, nullable: true })
    location?: string;
  
    @Column()
    futsal_level: UserLevel;
    
    @Column()
    role: UserRole;
  
    @OneToMany(() => Article, (article) => article.author, { eager: false })
    articles: Article[];
  
    // Comment와의 관계 설정 (작성한 댓글들)
    @OneToMany(() => Comment, (comment) => comment.author, { cascade: true })
    comments: Comment[];
  
    // TradePost와의 관계 설정 (작성한 거래 게시글)
    @OneToMany(() => TradePost, (tradePost) => tradePost.author, { cascade: true })
    tradePosts: TradePost[];
  
    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;
    
    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date;
  }
  