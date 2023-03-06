import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AddSlotDto } from './dto/addslot.dto';
import { BookSlotDto } from './dto/bookslot.dto';
import { SlotService } from './slot.service';

@Controller('slot')
export class SlotController {
  constructor(private readonly slotServices: SlotService) {}

  /**
   * ? user slot book api
   */
  @Post('/booking-slot')
  @UseGuards(JwtAuthGuard)
  async bookSlot(
    @Body() bookingSlotBook: BookSlotDto,
    @Request() req,
  ): Promise<any> {
    try {
      let response = await this.slotServices.doBookingSlot(
        bookingSlotBook,
        req.user,
      );
      return {
        code: 200,
        data: response,
        status: 'slot book successfully',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  /**
   * ? see their booking api
   */
  @Get('/:userId')
  @UseGuards(JwtAuthGuard)
  async getBookingData(@Param('userId') userId: number, @Request() req) {
    try {
      let response = await this.slotServices.doGetBooking(userId, req);
      return {
        code: 200,
        data: response,
        status: 'retrieve booking successfully',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  /**
   * ? user see  available  slot
   */

  @Get('/available/slot')
  @UseGuards(JwtAuthGuard)
  async checkAvailablity(@Request() req) {
    try {
      let response = await this.slotServices.doGetAvailableSlot(req.user);
      return {
        code: 200,
        data: response,
        status: 'retrieve slot successfully',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  /**
   * ? user see available slot for particular date
   */

  @Post('/date/slot')
  @UseGuards(JwtAuthGuard)
  async availabilityDate(@Body() date, @Request() req) {
    try {
      let response = await this.slotServices.doGetAvailableSlotDate(
        date,
        req.user,
      );
      return {
        code: 200,
        data: response,
        status: 'retrieve slot successfully',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  /**
   * ? user booking cancel  api
   */
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteBooking(@Param('id') slot_id: number, @Request() req) {
    try {
      let response = await this.slotServices.doDeleteBooking(slot_id, req.user);
      return {
        code: 200,
        data: response,
        status: 'delete booking successfully',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  /**
   * ? admin add slot api
   */

  @Post('/add-slot')
  @UseGuards(JwtAuthGuard)
  async addSlot(@Body() addSlotDto: AddSlotDto, @Request() req): Promise<any> {
    try {
      let response = await this.slotServices.doAddSlot(addSlotDto, req.user);
      return {
        code: 200,
        data: response,
        status: 'add slot successfully',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  /**
   * ? admin delete slot api
   */
  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteSlot(@Param('id') availableSlot_id: number, @Request() req) {
    try {
      let response = await this.slotServices.doDeleteSlot(
        availableSlot_id,
        req.user,
      );
      return {
        code: 200,
        data: response,
        status: 'slot delete successfully',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }
}
