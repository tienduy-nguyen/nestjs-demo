import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}
  @Get()
  sendMail(): any {
    return this.emailService.example();
  }

  @Get('template')
  sendTemplate(): any {
    return this.emailService.example2();
  }
  @Get('template2')
  sendTemplate2(): any {
    return this.emailService.example3();
  }
}
