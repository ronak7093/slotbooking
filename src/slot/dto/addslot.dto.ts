import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class AddSlotDto {
  @IsNotEmpty()
  @IsString()
  movieName: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  SlotTime: string;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;
}
