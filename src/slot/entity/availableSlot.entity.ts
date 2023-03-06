import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Slot } from 'src/user/entities/slot.entity';

@Entity({ name: 'available slot' })
export class AvailableSlot extends BaseEntity {
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
  date: Date;

  @Column({
    nullable: true,
    type: 'time',
  })
  SlotTime: string;

  @Column({
    nullable: true,
    type: 'int',
  })
  capacity: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  isAvailable: boolean;

  @ManyToOne(() => User, (user) => user.availableSlot)
  user: User;

  // @ManyToOne(() => Slot, (slot) => slot.availableSlot)
  // slot: Slot[];

  @ApiProperty({ description: 'When available slot was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When available slot was updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
