import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  getHello(): string {
    return 'Hello World!';
  }

  public example(): void {
    this.mailerService
      .sendMail({
        to: 'tienduy9x@gmail.com', // List of receivers email address
        from: 'noreply@nestjs.com', // Senders email address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public example2(): void {
    this.mailerService
      .sendMail({
        to: 'tienduy9x@outlook.com', // List of receivers email address
        from: 'noreply@nestjs.com', // Senders email address
        subject: 'Testing Nest Mailermodule with template ✔',
        template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'john doe',
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public example3(): void {
    this.mailerService
      .sendMail({
        to: 'tienduy9x@outlook.com',
        from: 'NestJS <noreply@nestjs.com>',
        subject: 'Testing Nest Mailermodule with template ✔',
        template: 'general', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'john doe',
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
