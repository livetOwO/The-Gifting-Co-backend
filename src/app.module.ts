import { Module } from '@nestjs/common';
import path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DatabaseModule } from './core/database.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'static'),
    }),
    DatabaseModule,
    UserModule,
  ],
})
export class AppModule {}
