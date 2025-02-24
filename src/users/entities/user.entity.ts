import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "./user-role.enum";
import { Article } from "src/articles/entities/article.entity";
import { CommonEntity } from "src/common/entites/common.entity";
import { UserLevel } from "./user-level.enum";


@Entity()
export class User{
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

    @OneToMany(Type => Article, article => article.author, { eager: false })
    articles: Article[];
    
    @CreateDateColumn({type: 'timestamp'})
    createAt: Date;
    
    @UpdateDateColumn({type: 'timestamp'})
    updateAt: Date;
}