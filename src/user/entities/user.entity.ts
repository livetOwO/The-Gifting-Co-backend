import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserPointLog } from './user-point-log.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  point: number;

  @OneToMany(() => UserPointLog, (pointLog) => pointLog.user)
  pointLogs: UserPointLog[];
}
