import { Module } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../../users/users.module';

import { AuthService } from './auth.service';
import { AuthStrategy } from './auth.strategy';
import { AuthResolvers } from './auth.resolvers';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secretOrPrivateKey: config.get('site.secret'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
    UsersModule,
  ],
  // controllers: [AuthController],
  providers: [AuthService, AuthStrategy, AuthResolvers],
})
export class AuthModule {}
