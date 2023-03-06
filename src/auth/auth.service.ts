import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CONSTANT } from 'src/helpers/apiMessage';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUser(email);
    if (!user) return null;
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!user) {
      throw new NotAcceptableException(CONSTANT.COULD_NOT_FIND_THE_USER);
    }
    if (user && passwordValid) {
      return user;
    }
    return null;
  }
  async login(user: any) {
    return {
      access_token: this.jwtService.sign(
        { id: user.id, name: user.name, role: user.role },
        { secret: `secretKey` },
      ),
    };
  }
}
