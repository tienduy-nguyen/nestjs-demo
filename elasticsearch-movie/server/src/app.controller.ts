import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private start: number;
  constructor(private readonly appService: AppService) {
    this.start = Date.now();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('healthcheck')
  public async healthcheck() {
    const now = Date.now();
    return {
      status: 'API Online',
      uptime: Number((now - this.start) / 1000).toFixed(0),
    };
  }
}
