import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserPointLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @RelationId((userPointLog: UserPointLog) => userPointLog.user)
  userId: number;

  @Column({ default: 0 })
  point: number;

  @Column({ nullable: true })
  comment: string;

  @Column({ default: false })
  isExpired: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.pointLogs)
  user: User;
}
