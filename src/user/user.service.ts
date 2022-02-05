import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserPointLog } from './entities/user-point-log.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserPointLog)
    private readonly userPointLogRepository: Repository<UserPointLog>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, point } = createUserDto;

    const user = new User();
    user.name = name;
    user.point = point;

    await this.userRepository.insert(user);

    const pointLog = new UserPointLog();
    pointLog.point = point;
    pointLog.comment = '초기 생성 포인트';
    pointLog.user = user;

    await this.userPointLogRepository.insert(pointLog);

    return user;
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id: id },
      relations: ['pointLogs'],
    });
  }
}
