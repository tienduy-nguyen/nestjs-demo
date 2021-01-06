import { Module } from '@nestjs/common';
import { UserService } from 'src/modules/users/users.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [UserService, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
