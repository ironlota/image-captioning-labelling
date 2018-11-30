import { ParseIntPipe, UseGuards, ConflictException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../shared/auth/auth.guard';
import { User as UserDecorator } from '../shared/auth/auth.decorator';

import { User, Caption } from './graphql/users.graphql.schema';
import { User as UserEntity } from './interfaces/user.interface';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EditCaptionDto } from './dto/edit-caption.dto';

@Resolver('User')
export class UsersResolvers {
  constructor(private readonly usersService: UsersService) {}

  @Query()
  @UseGuards(JwtAuthGuard)
  async allUsers(@Args('skip') skip?: number, @Args('limit') limit?: number) {
    return await this.usersService.findAll(skip, limit);
  }

  @Query('_allUsersMeta')
  @UseGuards(JwtAuthGuard)
  async _allUsersMeta() {
    return await this.usersService.countAll();
  }

  @Mutation('createUser')
  async create(@Args('createUserInput') args: CreateUserDto): Promise<User> {
    // pubSub.publish('catCreated', { catCreated: createdUser });
    const existingUser = await this.usersService.findUsername(args.username);

    if (existingUser)
      throw new ConflictException('Username is found in the server!');

    return await this.usersService.create(args);
  }

  @Query('user')
  @UseGuards(JwtAuthGuard)
  async findUsername(@Args('username') username: string): Promise<User> {
    return await this.usersService.findUsername(username);
  }

  @Mutation('editCaption')
  @UseGuards(JwtAuthGuard)
  async editCaption(
    @UserDecorator() user: UserEntity,
    @Args('createEditCaption') args: EditCaptionDto,
  ): Promise<User> {
    return await this.usersService.editCaption(user, args);
  }

  @Mutation('changePassword')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @UserDecorator() user: UserEntity,
    @Args('oldPassword') oldPassword: string,
    @Args('newPassword') newPassword: string,
  ): Promise<User> {
    return await this.usersService.changePassword(
      user,
      oldPassword,
      newPassword,
    );
  }
}