import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConfig, ConfigService } from 'nestjs-config';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './interfaces/user.interface';

import { CreateUserDto } from './dto/create-user.dto';
import { EditCaptionDto } from './dto/edit-caption.dto';
import { CurateCaptionDto } from './dto/curate-caption.dto';
import { EmotionCaptionDto } from './dto/emotion-caption.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectConfig() private readonly config: ConfigService,
    @InjectModel('users') private readonly userModel: Model<User>,
  ) {}

  async findAll(skip: number = 0, limit: number = 10): Promise<User[]> {
    return await this.userModel
      .find({}, null, { skip, limit /* sort: { image_id: 1} */ })
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

  async editCaption(user: User, create: EditCaptionDto): Promise<User> {
    try {
      const data = await this.userModel.findOne({
        username: user.username,
      });

      const foundCaption = data.captions.find(
        capt => capt.obj_id === create.obj_id,
      );

      if (!foundCaption.curatedCaptions.includes(create.caption_id)) {
        throw new UnauthorizedException(
          'Complete curation step before continuing!',
        );
      }

      if (
        foundCaption.step !== 'curated' &&
        foundCaption.step !== 'edited' &&
        foundCaption.step !== 'emotion'
      ) {
        throw new UnauthorizedException(
          'Complete curation step before continuing!',
        );
      }

      const foundSuitableCaptionEdit = foundCaption.captionEdit.find(
        dat => dat.caption_id === create.caption_id,
      );

      if (foundSuitableCaptionEdit) {
        foundSuitableCaptionEdit.text = create.text;
      } else {
        foundCaption.captionEdit.push({
          caption_id: create.caption_id,
          text: create.text,
        });
        data.captionEditCount += 1;
      }

      foundCaption.step = 'edited';

      const _data = await data.save();

      return _data;
    } catch (e) {
      throw new UnauthorizedException(
        'Complete previous step before continouing!',
      );
    }
  }

  async curateCaption(user: User, create: CurateCaptionDto): Promise<User> {
    const step =
      Number(create.curatedCaptions.length) === 5 ? 'edited' : 'curated';

    try {
      const data = await this.userModel.findOne({
        username: user.username,
      });

      const foundCaption = data.captions.find(
        capt => capt.obj_id === create.obj_id,
      );

      if (foundCaption) {
        foundCaption.step = step;
        foundCaption.curatedCaptions = create.curatedCaptions;
      } else {
        data.captions.push({
          ...create,
          step,
        });
        data.captionCuratedCount += create.curatedCaptions.length;
      }

      const _data = await data.save();

      return _data;
    } catch (e) {
      throw new InternalServerErrorException('Error while curating');
    }
  }

  async emotionCaption(user: User, create: EmotionCaptionDto): Promise<User> {
    const { image_id, obj_id, ...rest } = create;

    try {
      const data = await this.userModel.findOne({
        username: user.username,
      });

      const foundCaption = data.captions.find(
        capt => capt.obj_id === create.obj_id,
      );

      if (foundCaption.step !== 'edited' && foundCaption.step !== 'emotion') {
        throw new UnauthorizedException(
          'Complete curation and edited step before continuing!',
        );
      }

      if (Object.keys(foundCaption.captionEmotion._doc).length === 1) {
        data.captionEmotionCount += 1;
      }

      foundCaption.captionEmotion = rest;

      foundCaption.step = 'emotion';

      const _data = await data.save();

      return _data;
    } catch (e) {
      throw new UnauthorizedException(
        'Complete previous step before continouing!',
      );
    }
  }

  async changeStep(user: User, objId: number, status: string): Promise<User> {
    try {
      const data = await this.userModel.findOne({
        username: user.username,
      });
      const foundCaption = data.captions.find(capt => capt.obj_id === objId);

      foundCaption.step = status;

      const _data = await data.save();

      return _data;
    } catch (e) {
      throw new UnauthorizedException('Cannot override step');
    }
  }
}
