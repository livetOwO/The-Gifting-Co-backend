import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sql',
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule {}
