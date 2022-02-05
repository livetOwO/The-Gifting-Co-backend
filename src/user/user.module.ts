import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserPointLog } from './entities/user-point-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPointLog])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
