import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ROLES } from '../enum/roles.enum';
import { UserDeviceInformation } from './userDeviceInformation.entity';
import { Slot } from './slot.entity';
import { AvailableSlot } from 'src/slot/entity/availableSlot.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @ApiProperty({ description: 'Primary key as User ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'User fist name', example: 'Jhon ' })
  @Column({
    nullable: true,
    type: 'varchar',
  })
  name: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  email: string;

  @ApiProperty({ description: 'Hashed user password' })
  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    select: true,
    nullable: true,
    type: 'varchar',
  })
  deviceId: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: ROLES,
  })
  role: string;

  @Column({
    select: true,
    nullable: true,
    type: 'varchar',
  })
  mobileNo: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: Boolean;
  @OneToMany(
    () => UserDeviceInformation,
    (userDeviceInformation) => userDeviceInformation.user,
    { cascade: true },
  )
  userDeviceInformation: UserDeviceInformation[];

  @OneToMany(() => Slot, (slot) => slot.user)
  slot: Slot[];

  @OneToMany(() => AvailableSlot, (availableSlot) => availableSlot.user)
  availableSlot: AvailableSlot[];

  @ApiProperty({ description: 'When user was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When user was updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
