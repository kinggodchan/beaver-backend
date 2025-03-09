import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ 환경 변수 모듈 추가
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { UnauthorizedExceptionFilter } from './common/filters/unauthorization.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TeamsModule } from './teams/teams.module';
import { BoardModule } from './board/board.module';
import { CommentModule } from './comment/comment.module';
import { ReportModule } from './report/report.module';
import { InquiryModule } from './inquiry/inquiry.module'; // ✅ 문의하기 모듈 추가

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ .env 파일을 사용할 수 있도록 설정
    TypeOrmModule.forRoot(typeOrmConfig), // ✅ 기존 TypeORM 설정 유지
    ArticlesModule,
    AuthModule,
    UsersModule,
    TeamsModule,
    BoardModule,
    CommentModule,
    ReportModule,
    InquiryModule, // ✅ InquiryModule 추가 (문의하기 기능 활성화)
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
