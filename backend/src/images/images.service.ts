import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import * as isEmpty from 'lodash/isEmpty';

import { Image } from './interfaces/image.interface';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel('images-translateds')
    private readonly imageModel: Model<Image>,
  ) {}

  async countAll(): Promise<object> {
    const count = await this.imageModel.estimatedDocumentCount();
    return Promise.resolve({
      count,
    });
  }

  async findAll(
    skip: number = 0,
    limit: number = 10,
    search: string = '',
  ): Promise<Image[]> {
    return await this.imageModel
      .find(
        { ...(isEmpty(search) ? {} : { $text: { $search: search } }) },
        null,
        {
          skip,
          limit,
          sort: { image_id: 1 },
        },
      )
      .exec();
  }

  async findOne(obj_id: number): Promise<Image> {
    return await this.imageModel.findOne({ obj_id }).exec();
  }

  async findCocoUrlsFromImageIDs(images: [number]): Promise<(void | Image)[]> {
    return await Promise.all(
      images.map(image =>
        this.findOne(image)
          .then(_data => _data)
          .catch(() => {}),
      ),
    );
  }
}
