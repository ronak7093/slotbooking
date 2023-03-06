import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { SlotModule } from 'src/slot/slot.module';
import { Slot } from './entities/slot.entity';
import { mailService } from 'src/mail/mail.service';
import { MailModule } from '../mail/mail.module';
@Module({
  imports: [TypeOrmModule.forFeature([User, Slot]), MailModule],
  controllers: [UserController],
  providers: [UserService, JwtService, AuthService, JwtStrategy, mailService],
  exports: [UserService, JwtService, AuthService, JwtStrategy],
})
export class UserModule {}
