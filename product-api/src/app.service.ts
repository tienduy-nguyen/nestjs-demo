import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config';

@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}

  root(): string {
    return this.config.get('APP_URL');
  }
}
