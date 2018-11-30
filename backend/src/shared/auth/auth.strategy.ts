import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectConfig, ConfigService } from 'nestjs-config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectConfig() private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('site.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    const _user = await this.authService.validateUser(payload);

    if (!_user) {
      throw new UnauthorizedException('Token is invalid!');
    }

    const { password, ...user } = _user;

    return user;
  }
}
