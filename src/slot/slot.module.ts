import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Slot } from 'src/user/entities/slot.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AvailableSlot } from './entity/availableSlot.entity';
import { SlotController } from './slot.controller';
import { SlotService } from './slot.service';

@Module({
  imports: [TypeOrmModule.forFeature([AvailableSlot, Slot, User])],
  providers: [SlotService],
  controllers: [SlotController],
  exports: [],
})
export class SlotModule {}
