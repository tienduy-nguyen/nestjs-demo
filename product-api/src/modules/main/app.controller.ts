import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
// import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @UseGuards(AuthGuard())
  root(): string {
    return this.appService.root();
  }
}
