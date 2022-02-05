import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { UserPointLog } from './entities/user-point-log.entity';
import { UpdateUserPointDto } from './dto/update-user-point.dto';
import { Cron } from '@nestjs/schedule';

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

  // 1분 마다 호출되는 함수
  @Cron('* * * * *')
  async decrementExpiredPoint() {
    const expiredDate = new Date();
    expiredDate.setFullYear(expiredDate.getFullYear() - 1);

    const logs = await this.userPointLogRepository.find({
      where: {
        createdAt: LessThanOrEqual(
          expiredDate.toISOString().replace('T', ' ').replace('Z', ''),
        ),
        isExpired: false,
        point: MoreThan(0),
      },
    });

    const ids = logs.map((log) => log.id);
    const usersDecrementPoint = logs.reduce((prev, log) => {
      if (!prev[log.userId]) prev[log.userId] = 0;

      prev[log.userId] += log.point;

      return prev;
    }, []);

    usersDecrementPoint.forEach((point, id) => {
      this.userRepository.decrement({ id: id }, 'point', point);
      this.createPointLog(id, -point, '소멸 포인트');
    });

    this.userPointLogRepository.update({ id: In(ids) }, { isExpired: true });
  }
}
