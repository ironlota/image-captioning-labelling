import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { ImagesResolvers } from './images.resolvers';
import { ImagesSchema } from './schemas/image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'images-translateds', schema: ImagesSchema },
    ]),
  ],
  // controllers: [ImagesController],
  providers: [ImagesService, ImagesResolvers],
})
export class ImagesModule {}
