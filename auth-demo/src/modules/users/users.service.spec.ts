import { Test, TestingModule } from '@nestjs/testing';
import { User, UserService } from './users.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.each`
    name       | returnVal
    ${'user1'} | ${{ userId: 1, username: 'user1', password: '1234567' }}
  `(
    'should call findOne for $name and return $returnVal',
    async ({ name, returnVal }: { name: string; returnVal: User }) => {
      expect(await service.findOne(name)).toEqual(returnVal);
    },
  );
});
