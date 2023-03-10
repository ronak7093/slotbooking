import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import path from 'path';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class mailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;
    await this.mailerService.sendMail({
      to: 'brijesh.b@upsquare.in',
      from: 'brijesh.b@upsquare.in',
      subject: 'forgot password',
      template: '/forgotPassword.html',
      context: {
        name: user.name,
        url,
      },
    });
  }
}

// const template = (file) => {
//   return compile(fs.readFileSync(file, 'utf8'));
// };

// export const templates = {
//   forgotPassword: template('src/user/resource/forgotPassword.html'),
// };
