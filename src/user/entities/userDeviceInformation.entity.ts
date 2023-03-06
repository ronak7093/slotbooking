import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'UserDeviceInformation' })
export class UserDeviceInformation extends BaseEntity {
  @ApiProperty({ description: 'Primary key as User ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    select: true,
    nullable: true,
    type: 'varchar',
  })
  deviceId: string;

  @ManyToOne(() => User, (user) => user.userDeviceInformation, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  user: User;
  @ApiProperty({ description: 'When user  deviceId was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When user deviceId was updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
