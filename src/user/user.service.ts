import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { CONSTANT } from 'src/helpers/apiMessage';
import { UpdateUserDto } from './dto/update-user.dto';
import { MESSAGES } from '@nestjs/core/constants';
import { mailService } from '../mail/mail.service';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  constructor(
    private mailServices: mailService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async doUserSignup(payload: CreateUserDto): Promise<any> {
    let findUser = await this.usersRepository.findOne({
      where: {
        email: payload.email,
      },
    });

    if (findUser) {
      throw new HttpException(CONSTANT.USER_ALREADY_EXISTS, 400);
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    /**
     * ? Hash password first
     */
    const hashedPassword = await bcrypt.hash(payload.password, salt);
    console.log(hashedPassword, 123);
    let userRecord = new User();
    userRecord.name = payload.name;
    userRecord.email = payload.email;
    userRecord.password = hashedPassword;
    userRecord.role = payload.role;
    userRecord.mobileNo = payload.mobileNumber;
    userRecord.deviceId = payload.deviceId;
    await this.usersRepository.save(userRecord);
    return userRecord;
  }

  async doUserLogin(payload): Promise<any> {
    let { email, password } = payload.body;
    let userRecord = await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!userRecord) {
      throw new HttpException(CONSTANT.USER_NOT_FOUND, 404);
    }
    if (payload.type == 'admin') {
      const passwordValid = await bcrypt.compare(password, userRecord.password);
      if (passwordValid) {
        return userRecord;
      } else {
        throw new HttpException(CONSTANT.INVALID_PASSWORD, 404);
      }
    } else {
      const passwordValid = await bcrypt.compare(password, userRecord.password);
      if (passwordValid) {
        return userRecord;
      } else {
        throw new HttpException(CONSTANT.INVALID_PASSWORD, 404);
      }
    }
    // if (!userRecord.password) {
    //   throw new HttpException(CONSTANT.INVALID_LOGIN_OR_PASSWORD, 404);
    // }
    // let validPassword = await bcrypt.compare(
    //   payload.password,
    //   userRecord.password,
    // );
    // if (validPassword) {
    //   return userRecord;
    // } else {
    //   throw new HttpException(CONSTANT.INVALID_PASSWORD, 404);
    // }
  }

  async getUser(email): Promise<User> {
    let userRecord = await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
    return userRecord;
  }

  async doFindOneUser(id: number, Payload) {
    let { role } = Payload.userRecord;

    if (role === 'admin') {
      let userRecord = await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!userRecord) {
        throw new HttpException(CONSTANT.USER_NOT_FOUND, 404);
      }

      let userData = {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        role: userRecord.role,
      };

      return userData;
    }
  }

  async doGetAllUsers(limit, page, Payload) {
    let userData = [];
    let { role } = Payload.userRecord;
    if (role == 'admin') {
      if (page == 0) {
        page = 1;
      }
      let skip = page == 0 ? limit : (page - 1) * limit;
      let allUser = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.role = :role', { role: 'user' })
        .take(limit)
        .skip(skip)
        .getMany();
      console.log(allUser, 123);

      let allUserCount = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.role = :role', { role: 'user' })
        .take(limit)
        .skip(skip)
        .getCount();
      console.log(allUserCount, 123);
      const totalPages = Math.ceil(allUserCount / limit);
      const currentPage = page;
      const currentPageRecords = allUserCount;

      let isLastPage = true;
      if (allUserCount / limit > page) {
        isLastPage = false;
      }
      allUser.map((user) => {
        let data = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
        userData.push(data);
      });

      let data = {
        data: userData,
        totalPages: totalPages,
        currentPage: currentPage,
        currentPageRecords: currentPageRecords,
        isLastPage: isLastPage,
      };
      return data;
    }
  }

  async doUpdateUser(id: number, updateUser: UpdateUserDto, Payload) {
    let userRecord = await this.usersRepository.findOne({
      where: {
        id: Payload.id,
      },
    });
    if (!userRecord) {
      throw new HttpException(CONSTANT.USER_NOT_FOUND, 404);
    }
    let userToSave = new User();
    userToSave.name = updateUser.name;
    userToSave.email = updateUser.email;
    userToSave.role = updateUser.role;
    userToSave.mobileNo = updateUser.mobileNumber;
    await this.usersRepository.update(id, userToSave);
    return userToSave;
  }

  async doForgotPassword(Payload) {
    try {
      let userRecord = await this.usersRepository.findOne({
        where: {
          email: Payload.email,
        },
      });
      if (!userRecord) {
        throw new HttpException(CONSTANT.EMAIL_DOES_NOT_EXISTS, 404);
      }
      await this.mailServices.sendUserConfirmation(
        //@ts-ignore
        userRecord.email,
        'forget password',
      );
      return;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  async doUserLogout(Payload) {
    let userRecord = await this.usersRepository.findOne({
      where: {
        deviceId: Payload.deviceId,
      },
    });
    if (!userRecord) {
      throw new HttpException(CONSTANT.USER_NOT_FOUND, 404);
    }
  }
  async doRemoveUser(id: number, Payload) {
    let { role } = Payload.userRecord;
    if (role == 'admin') {
      let userRecord = await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!userRecord) {
        throw new HttpException(CONSTANT.USER_NOT_FOUND, 404);
      }
      userRecord.isDeleted = true;
      await this.usersRepository.update(userRecord.id, userRecord);
      return userRecord;
    } else {
      throw new HttpException(CONSTANT.ADMIN_MAKE_CHANGES, 404);
    }
  }
}
