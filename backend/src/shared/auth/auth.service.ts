import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { User } from '../../users/interfaces/user.interface';
import { UsersService } from '../../users/users.service';

import { JwtPayload, JwtResponse } from './interfaces';
import { CreateLoginDto } from './dto/create-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn({ username, password }: CreateLoginDto): Promise<JwtResponse> {
    const _user = await this.usersService.findUsername(username);

    if (!_user) {
      throw new NotFoundException('Username is not found!');
    }

    const match = await bcrypt.compare(password, _user.password);

    if (!match) {
      throw new UnauthorizedException('User and password do not match!');
    }

    const user = await this.usersService.findUsernameAndUpdate(_user.username, {
      $set: { lastLogin: Date.now() },
    });

    const { password: pass, captions, ...rest } = user;

    const accessToken = this.jwtService.sign(rest);

    return {
      expiresIn: 3600,
      accessToken,
    };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    return await this.usersService.findUsername(payload.username);
  }
}
