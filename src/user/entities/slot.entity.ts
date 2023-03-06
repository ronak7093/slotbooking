import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { AvailableSlot } from 'src/slot/entity/availableSlot.entity';

@Entity({ name: 'slot' })
export class Slot extends BaseEntity {
  @ApiProperty({ description: 'Primary key as User ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  movieName: string;

  @Column({
    type: 'date',
  })
  bookedDate: Date;
  @Column({
    nullable: true,
    type: 'time',
  })
  bookSlotTime: string;

  @Column({
    type: 'int',
  })
  totalBooking: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  isBooked: Boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: Boolean;

  @ManyToOne(() => User, (user) => user.slot)
  user: User;

  // @OneToMany(() => AvailableSlot, (availableSlot) => availableSlot.slot)
  // availableSlot: AvailableSlot;

  @ApiProperty({ description: 'When slot was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When slot was updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
