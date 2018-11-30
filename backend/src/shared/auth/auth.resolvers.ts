import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';

import { JwtResponse } from './interfaces/jwt-response.interface';
import { CreateLoginDto } from './dto/create-login.dto';

import { User } from './auth.decorator';
import { User as UserEntity } from '../../users/interfaces/user.interface';

@Resolver('Auth')
export class AuthResolvers {
  constructor(private readonly authService: AuthService) {}

  @Mutation('login')
  async create(
    @Args('createUserLogin') payload: CreateLoginDto,
  ): Promise<JwtResponse> {
    return await this.authService.signIn(payload);
  }

  @Query('currentUser')
  @UseGuards(JwtAuthGuard)
  async currentUser(@User() user: UserEntity): Promise<UserEntity> {
    return user;
  }
}
