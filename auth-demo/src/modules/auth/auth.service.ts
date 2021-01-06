import { Injectable } from '@nestjs/common';
import { User, UserService } from 'src/modules/users/users.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private _userService: UserService) {}

  public async validateUser(username: string, password: string): Promise<any> {
    const user: User = this._userService.findOne(username);
    if (user) {
      const isMatch = await bcrypt.compare(user.password, password);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }
}
