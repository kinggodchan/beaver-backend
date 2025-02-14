import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST, 
    port: Number(process.env.DB_PORT), 
    username: process.env.DB_USER, 
    password: process.env.DB_PW, 
    database: process.env.DB_NAME, 
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true, 
    logging: true, 
};