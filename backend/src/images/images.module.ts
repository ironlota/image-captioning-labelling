import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ImagesService } from './images.service';
import { ImagesResolvers } from './images.resolvers';
import { ImagesSchema } from './schemas/image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'images-translateds', schema: ImagesSchema },
    ]),
  ],
  providers: [ImagesService, ImagesResolvers],
})
export class ImagesModule {}
