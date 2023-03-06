import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Timestamp } from 'typeorm';

export class BookSlotDto {
  @IsNotEmpty()
  @IsString()
  movieName: string;

  @IsNotEmpty()
  @IsDate()
  bookedDate: Date;

  @IsNotEmpty()
  @IsString()
  bookSlotTime: string;

  @IsNotEmpty()
  @IsNumber()
  totalBooking: number;
}
