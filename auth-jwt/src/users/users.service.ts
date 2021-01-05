import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private _userRepository: Repository<User>,
  ) {}

  public async findUsers(): Promise<User[]> {
    return await this._userRepository.find();
  }

  public async findUserById(id: number): Promise<User> {
    return await this._userRepository.findOne(id);
  }

  public async createUser(userDto: CreateUserDto): Promise<User> {
    return await this._userRepository.save(userDto);
  }

  public async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this._userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.city = updateUserDto.city;
    user.country = updateUserDto.country;
    user.email = updateUserDto.email;
    return await this._userRepository.save(user);
  }

  public async deleteUser(id: number): Promise<void> {
    await this._userRepository.delete(id);
  }
}
