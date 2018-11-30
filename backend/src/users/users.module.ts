import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { UsersResolvers } from './users.resolvers';
import { UsersSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'users', schema: UsersSchema }]),
  ],
  providers: [UsersService, UsersResolvers],
  exports: [UsersService],
})
export class UsersModule {}
