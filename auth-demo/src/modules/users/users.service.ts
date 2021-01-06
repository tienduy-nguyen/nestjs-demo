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
        password:
          '$2b$10$EDvLHjL275dFbP0fNoC2He99Gni9B44vS8AmKvPeNmI2gffXKp66i', //1234567
      },
      {
        userId: 2,
        username: 'user2',
        password:
          '$2b$10$clmHYwO5xiPd/9QQI39uRuhjN9FC.lu/YavG512o5aCZSV4QAguxG', //1234567 bcrypt
      },
      {
        userId: 3,
        username: 'user3',
        password:
          '$2b$10$P8k4AQVEleFIe1BlQFjV7e3RAZ/bIUQJX2gdp5kdYzrI2fYZyZCuG', //1234567
      },
    ];
  }

  public async getAllUser(): Promise<User[]> {
    return this.users;
  }
  public async findOne(username: string): Promise<User | undefined> {
    return this.users.find((u) => u.username === username);
  }
}
