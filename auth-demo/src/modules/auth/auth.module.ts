import { Module } from '@nestjs/common';
import { UserService } from 'src/modules/users/users.service';
import { AuthService } from './auth.service';

@Module({
  imports: [UserService],
  providers: [AuthService],
})
export class AuthModule {}
