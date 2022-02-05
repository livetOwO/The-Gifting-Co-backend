import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserPointLog } from './entities/user-point-log.entity';
import { UpdateUserPointDto } from './dto/update-user-point.dto';

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
    await this.createPointLog(user.id, point, '초기 생성 포인트');

    return user;
  }

  createPointLog(userId: number, point: number, comment: string) {
    const pointLog = new UserPointLog();

    pointLog.point = point;
    pointLog.comment = comment;
    pointLog.userId = userId;

    return this.userPointLogRepository.insert(pointLog);
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

  async updateUserPoint(updateUserPointDto: UpdateUserPointDto) {
    const { userId, comment, point } = updateUserPointDto;

    await Promise.all([
      this.userRepository.increment({ id: +userId }, 'point', +point),
      this.createPointLog(+userId, +point, comment),
    ]);

    return true;
  }
}
