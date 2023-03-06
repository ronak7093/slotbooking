import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotUserDto } from './dto/forgotpassword.dto';
import { LoginUserDto } from './dto/login.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  /**
   * ? signup api
   */
  @Post('/signup')
  async userSignup(@Body() req: CreateUserDto): Promise<any> {
    try {
      let response = await this.userService.doUserSignup(req);
      return {
        code: 200,
        data: response,
        status: 'success',
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  /**
   * ? simple login api
   */

  // @Post('/login')
  // async userLogin(@Body() req: LoginUserDto): Promise<any> {
  //   let response = await this.userService.doUserLogin(req);
  //   let Response = await this.authService.login(response);
  //   return {
  //     data: Response,
  //     status: 'success',
  //   };
  // }

  /**
   * ? admin login api
   */

  @Post('admin/login')
  async adminLogin(@Body() body): Promise<any> {
    try {
      let response = await this.userService.doUserLogin({
        body: body,
        type: 'admin',
      });
      let Response = await this.authService.login(response);
      return {
        code: 200,
        data: Response,
        status: 'success',
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
  /**
   * ? user login api
   */
  @Post('/login')
  async userLogin(@Body() body): Promise<any> {
    try {
      let response = await this.userService.doUserLogin({
        body: body,
        type: 'user',
      });

      let Response = await this.authService.login(response);
      return {
        code: 200,
        data: Response,
        status: 'success',
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  /**
   * ? admin check user by userId
   */
  @Get('user/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Request() req) {
    try {
      let response = await this.userService.doFindOneUser(+id, req.user);
      return {
        code: 200,
        data: response,
        status: 'success',
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  /**
   * ? admin retrieve  all user
   */

  @Get('/alllist')
  @UseGuards(JwtAuthGuard)
  async allData(@Query() query, @Request() req) {
    try {
      let response = await this.userService.doGetAllUsers(
        query.limit,
        query.page,
        req.user,
      );
      return {
        code: 200,
        data: response,
        status: 'success',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  /**
   * ? profile
   */

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    try {
      return {
        code: 200,
        data: {
          name: req.user.userRecord.name,
          email: req.user.userRecord.email,
        },
        status: 'success',
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  /**
   * ? update data only admin
   */
  @Put('/update/user')
  @UseGuards(JwtAuthGuard)
  async updateUserData(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    try {
      let response = await this.userService.doUpdateUser(
        +id,
        updateUserDto,
        req,
      );
      return {
        code: 200,
        data: response,
        status: 'updated successfully',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  /**
   * ? forgot password
   */
  @Post('/forgot-password')
  async forgotPassword(@Body() req: ForgotUserDto) {
    try {
      let response = await this.userService.doForgotPassword(req);
      return {
        code: 200,
        data: response,
        status: 'forgot password successfully',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  /**
   * ? logout
   */

  @Post('/logout')
  async logoutUser(@Body() req: LogoutUserDto) {
    try {
      let response = await this.userService.doUserLogout(req);
      return {
        code: 200,
        data: response,
        status: 'logout successfully',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  /**
   * ? delete user
   */
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string, @Request() req) {
    try {
      let response = await this.userService.doRemoveUser(+id, req.user);
      return {
        code: 200,
        data: response,
        status: 'Delete successFully',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }
}
