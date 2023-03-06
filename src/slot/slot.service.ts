import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Slot } from 'src/user/entities/slot.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CONSTANT } from 'src/helpers/apiMessage';
import { BookSlotDto } from './dto/bookslot.dto';
import { User } from 'src/user/entities/user.entity';
import { AddSlotDto } from './dto/addslot.dto';
import { AvailableSlot } from './entity/availableSlot.entity';
import * as moment from 'moment';

@Injectable()
export class SlotService {
  constructor(
    @InjectRepository(Slot) private slotRepository: Repository<Slot>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(AvailableSlot)
    private availableSlotRepository: Repository<AvailableSlot>,
  ) {}

  async doBookingSlot(bookingSlotBook: BookSlotDto, Payload): Promise<any> {
    let { role, id } = Payload.userRecord;
    if (role == 'user') {
      let checkUser = await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!checkUser) {
        throw new HttpException(CONSTANT.USER_NOT_FOUND, 404);
      }
      let FormateDate = moment(bookingSlotBook.bookedDate).format('YYYY-MM-DD');
      let availableSlotRecord = await this.availableSlotRepository.findOne({
        where: {
          //@ts-ignore
          date: FormateDate,
          SlotTime: bookingSlotBook.bookSlotTime,
        },
      });
      console.log(availableSlotRecord, 789);
      if (!availableSlotRecord) {
        throw new HttpException(CONSTANT.SLOT_NOT_AVAILABLE, 404);
      }

      let bookSlotToSave = new Slot();
      bookSlotToSave.movieName = bookingSlotBook.movieName;
      bookSlotToSave.bookedDate = bookingSlotBook.bookedDate;
      bookSlotToSave.bookSlotTime = bookingSlotBook.bookSlotTime;
      bookSlotToSave.totalBooking = bookingSlotBook.totalBooking;
      bookSlotToSave.isBooked = true;
      bookSlotToSave.user = checkUser;
      let result = await this.slotRepository.save(bookSlotToSave);
      if (result) {
        availableSlotRecord.capacity =
          availableSlotRecord.capacity - bookingSlotBook.totalBooking;
        await this.availableSlotRepository.update(
          availableSlotRecord.id,
          availableSlotRecord,
        );
      }

      let userObj = {
        id: bookSlotToSave.user.id,
        name: bookSlotToSave.user.name,
        email: bookSlotToSave.user.email,
        role: bookSlotToSave.user.role,
      };
      //@ts-ignore
      bookSlotToSave.user = userObj;
      return {
        bookSlotToSave,
      };
    } else {
      throw new HttpException(CONSTANT.USER_SLOT_BOOKING, 404);
    }
  }

  async doGetBooking(userId: number, Payload) {
    let bookingRecord = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['slot'],
    });
    if (!bookingRecord) {
      throw new HttpException(CONSTANT.USER_NOT_FOUND, 404);
    }

    let userObj = {
      id: bookingRecord.id,
      name: bookingRecord.name,
      email: bookingRecord.email,
      role: bookingRecord.role,
      slot: bookingRecord.slot,
    };
    return {
      userObj,
    };
  }

  async doGetAvailableSlot(Payload) {
    let { id, role } = Payload.userRecord;
    if (role == 'user') {
      let userDetails = await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });
      console.log(userDetails);

      if (!userDetails) {
        throw new HttpException(CONSTANT.USER_NOT_FOUND, 404);
      }
      let result = await this.availableSlotRepository
        .createQueryBuilder('availableSlot')
        .where('availableSlot.isAvailable =:isAvailable', {
          isAvailable: true,
        })
        .getMany();
      console.log(result, 789);

      return result;
    }
  }

  async doGetAvailableSlotDate(date, Payload) {
    let { role } = Payload.userRecord;
    if (role == 'user') {
      let dateFormate = moment(date).format('YYYY-MM-DD');
      let result = await this.availableSlotRepository
        .createQueryBuilder('availableSlot')
        .where('availableSlot.date >= :date', { date: dateFormate })
        .getMany();
      return result;
    }
  }

  async doDeleteBooking(slot_id: number, Payload) {
    let { role } = Payload.userRecord;
    if (role == 'user') {
      let checkSlot = await this.slotRepository.findOne({
        where: {
          id: slot_id,
        },
        relations: ['user'],
      });
      if (!checkSlot) {
        throw new HttpException(CONSTANT.SLOT_BOOK_NOT_FOUND, 404);
      }
      checkSlot.isDeleted = true;
      let data = await this.slotRepository.save(checkSlot);
      let userObj = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      };
      //@ts-ignore
      data.user = userObj;
      return {
        data,
      };
    } else {
      throw new HttpException(CONSTANT.USER_CANCEL_BOOKING, 404);
    }
  }

  async doAddSlot(addSlotDto: AddSlotDto, Payload) {
    let { id, role } = Payload.userRecord;

    if (role == 'admin') {
      let checkUser = await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });
      console.log(checkUser, 456);
      if (!checkUser) {
        throw new HttpException(CONSTANT.USER_NOT_FOUND, 404);
      }
      let data = [];
      for (let i = 0; i < addSlotDto.SlotTime.length; i++) {
        let slotToSave = new AvailableSlot();
        slotToSave.movieName = addSlotDto.movieName;
        slotToSave.date = addSlotDto.date;
        slotToSave.SlotTime = addSlotDto.SlotTime[i];
        slotToSave.capacity = addSlotDto.capacity;
        slotToSave.user = checkUser;
        data.push(await this.availableSlotRepository.save(slotToSave));
      }
      console.log(data, 456);

      await Promise.all(
        data.map(async (item) => {
          let UserObj = {
            id: item.user.id,
            name: item.user.name,
            email: item.user.email,
            role: item.user.role,
          };
          //@ts-ignore
          item.user = UserObj;
        }),
      );
      return { data };
    } else {
      throw new HttpException(CONSTANT.ONLY_THE_ADMIN_CAN_ADD_A_SLOT, 404);
    }
  }

  async doDeleteSlot(availableSlot_id: number, Payload) {
    let { role } = Payload.userRecord;
    if ((role = 'admin')) {
      let slotDetails = await this.availableSlotRepository.findOne({
        where: {
          id: availableSlot_id,
        },
        relations: ['user'],
      });
      console.log(slotDetails, 963);
      if (!slotDetails) {
        throw new HttpException(CONSTANT.SLOT_NOT_FOUND, 404);
      }
      await this.availableSlotRepository.delete(availableSlot_id);
      return;
    }
  }
}
