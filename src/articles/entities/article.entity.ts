import { Column, Entity, ManyToOne} from "typeorm";
import { User } from "src/users/entities/user.entity";
import { CommonEntity } from "src/common/entites/common.entity";
import { ArticleStatus } from "./article-status.enum";


@Entity()
export class Article extends CommonEntity {
    @Column()
    author: string;

    @Column()
    title: string;

    @Column()
    contents: string;
    
    @Column()
    status: ArticleStatus;

    @ManyToOne(Type => User, user => user.articles, { eager: false })  
    user: User;
}