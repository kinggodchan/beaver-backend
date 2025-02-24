import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';


dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:'http://localhost:4200',
    credential: true,
    exposedHeader: ['Authorization']
  })
  
  // await app.listen(process.env.SERVER_PORT); 오류 발생
  const port = process.env.PORT ?? 3000; // 기본값 설정
  await app.listen(port);
  Logger.log(`Application Running on Port : ${process.env.PORT}`)
}
bootstrap();
