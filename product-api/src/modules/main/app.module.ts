import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from 'src/modules/config/config.service';
import { ConfigModule } from 'src/modules/config/config.module';

@Module({
  imports: [ConfigModule],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
