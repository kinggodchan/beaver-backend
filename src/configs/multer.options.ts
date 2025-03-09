import * as multerS3 from 'multer-s3';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { S3Client } from '@aws-sdk/client-s3';


export const multerOptionsFactory = (configService: ConfigService): MulterOptions => {
  const s3 = new S3Client({
    region: configService.get<string>('AWS_REGION') as string,
    credentials: {
      accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID') as string,
      secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY')as string,
    },
  });

  return {
    storage: multerS3({
      s3: s3,  // S3Client 인스턴스를 전달
      bucket: configService.get<string>('AWS_S3_BUCKET'),
      acl: 'public-read', // 파일을 공개 URL로 접근 가능하도록 설정
      key: (req, file, cb) => {
        const fileExt = extname(file.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
        cb(null, `teams/${fileName}`); // S3의 teams 폴더에 저장
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
  };
};
