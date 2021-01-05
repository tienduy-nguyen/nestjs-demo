import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private _userRepository: Repository<User>,
  ) {}

  public async getUsers(): Promise<User[]> {
    return await this._userRepository.find();
  }

  public async getUserById(id: number): Promise<User> {
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
    const updated = Object.assign(user, updateUserDto);
    return await this._userRepository.save(updated);
  }

  public async deleteUser(id: number): Promise<void> {
    await this._userRepository.delete(id);
  }
}
