import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UserService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'user1',
        password: '1234567',
      },
      {
        userId: 2,
        username: 'user2',
        password: '1234567',
      },
      {
        userId: 3,
        username: 'user3',
        password: '1234567',
      },
    ];
  }

  public async findOne(username: string): Promise<User | undefined> {
    return this.users.find((u) => u.username === username);
  }
}
