import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectConfig, ConfigService } from 'nestjs-config';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './interfaces/user.interface';
import { Caption } from './interfaces/caption.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { EditCaptionDto } from './dto/edit-caption.dto';
import { AwaitExpression } from 'ts-simple-ast';

@Injectable()
export class UsersService {
  constructor(
    @InjectConfig() private readonly config: ConfigService,
    @InjectModel('users') private readonly userModel: Model<User>,
  ) {}

  async findAll(skip: number = 0, limit: number = 10): Promise<User[]> {
    return await this.userModel
      .find({}, null, { skip, limit, sort: { image_id: 1 } })
      .exec();
  }

  async countAll(): Promise<object> {
    const count = await this.userModel.estimatedDocumentCount();
    return Promise.resolve({
      count,
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const createdUser = new this.userModel({
      ...rest,
      verified: false,
      password: await bcrypt.hash(
        password,
        Number(this.config.get('site.salt')),
      ),
    });
    return await createdUser.save();
  }

  async findUsername(username: string): Promise<User> {
    return await this.userModel
      .findOne({ username })
      .exec()
      .then(doc => doc._doc)
      .catch(() => false);
  }

  async findUsernameAndUpdate(
    username: string,
    condition: object,
  ): Promise<User> {
    return await this.userModel
      .findOneAndUpdate({ username }, condition, {
        new: true,
      })
      .exec()
      .then(doc => doc._doc)
      .catch(() => false);
  }

  async editCaption(user: User, create: EditCaptionDto): Promise<User> {
    try {
      const data = await this.userModel
        .findOneAndUpdate(
          {
            username: user.username,
            ['captionEdit.caption_id']: create.caption_id,
          },
          { $set: { 'captionEdit.$': { ...create } } },
          { new: true },
        )
        .exec()
        .then(_data => _data._doc);

      return data;
    } catch (e) {
      return await this.userModel
        .findOneAndUpdate(
          {
            username: user.username,
          },
          { $push: { captionEdit: create }, $inc: { captionEditCount: 1 } },
          { new: true },
        )
        .exec()
        .then(data => data._doc)
        .catch(() => false);
    }
  }

  async changePassword(user: User, oldPassword: string, newPassword: string) {
    const _user = await this.findUsername(user.username);

    const match = await bcrypt.compare(oldPassword, _user.password);

    if (!match) {
      throw new UnauthorizedException('Old password does not match!');
    }

    const updatedUser = await this.findUsernameAndUpdate(_user.username, {
      $set: {
        password: await bcrypt.hash(
          newPassword,
          Number(this.config.get('site.salt')),
        ),
      },
    });

    return updatedUser;
  }
}
