import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { User } from 'src/user/entities/user.entity';
import { mailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          Service: 'gmail',
          // host: config.get('MAIL_HOST'),
          host: config.get('MAIL_FROM'),
          secure: true,
          auth: {
            user: config.get('MAIL_FROM'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'src/user/resource/forgotPassword.html'),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [mailService],
  exports: [mailService],
})
export class MailModule {}
