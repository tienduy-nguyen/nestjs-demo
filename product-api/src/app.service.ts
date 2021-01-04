import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/modules/config';

@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}

  root(): string {
    return 'API Running!';
  }
}
