import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 파일 업로드를 위한 multer 설정
  // app.use(
  //   multer({ dest: './uploads' }).single('image'),  // 'image'는 form-data의 키
  // );

  app.enableCors({
    origin:'http://localhost:4200',
    credential: true,
    exposedHeader: ['Authorization']
  })
  
  
  const port = process.env.PORT ?? 3000; // 기본값 설정
  await app.listen(port);
  Logger.log(`Application Running on Port : ${process.env.PORT}`)
}
bootstrap();
