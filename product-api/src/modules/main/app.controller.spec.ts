import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from 'src/modules/config';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
      imports: [ConfigModule],
    }).compile();
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "http://localhost"', () => {
      expect(appController.root()).toBe('http://localhost');
    });
  });
});
