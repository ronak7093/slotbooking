import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}
