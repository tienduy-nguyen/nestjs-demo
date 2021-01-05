import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private _userService: UsersService) {}
  @Get()
  public async getUsers(): Promise<User[]> {
    return await this._userService.getUsers();
  }

  @Get('/:id')
  public async getUser(@Param('id') id: number): Promise<User> {
    return await this._userService.getUserById(id);
  }

  @Post()
  public async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this._userService.createUser(createUserDto);
  }

  @Put('/:id')
  public async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this._userService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  public async deleteUser(@Param('id') id: number) {
    return this._userService.deleteUser(id);
  }
}
