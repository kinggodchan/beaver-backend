import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as multer from 'multer';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 파일 업로드를 위한 multer 설정
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads'); // 업로드할 경로
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // 파일 이름 설정
    },
  });

  const upload = multer({ storage });

  // 파일 업로드 라우터 설정 (예시)
  app.use('/upload', upload.single('image')); // 'image'는 form-data의 키

  // CORS 설정
  app.enableCors({
    origin: 'http://localhost:3001', // React 앱의 주소
    credentials: true,
    exposedHeaders: ['Authorization'],
});

  const port = process.env.PORT ?? 3000; // 기본값 설정
  await app.listen(port);
  Logger.log(`Application Running on Port: ${port}`); // 환경변수에서 포트 가져오기
}

bootstrap();
