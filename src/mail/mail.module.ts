import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { User } from 'src/user/entities/user.entity';
import { mailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          // Service: 'yandex',
          // host: config.get('MAIL_HOST'),
          host: 'smtp.yandex.com',
          port: config.get('MAIL_PORT'),
          secure: true,
          auth: {
            user: config.get('MAIL_ADDRESS'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        preview: true,
        template: {
          dir: join(__dirname, 'src/user/resource/forgotPassword.html'),
          adapter: new HandlebarsAdapter(),
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
