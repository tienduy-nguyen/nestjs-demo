import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PayloadJwt } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private _userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(username: string, password: string): Promise<any> {
    const user = await this._userService.findOne(username);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  public async login(user: any) {
    const payload: PayloadJwt = {
      username: user.username,
      userId: user.userId,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
