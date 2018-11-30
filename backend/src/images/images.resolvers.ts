import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
// import { PubSub } from 'graphql-subscriptions';

import { JwtAuthGuard } from '../shared/auth/auth.guard';
import { User as UserEntity } from '../users/interfaces/user.interface';
import { Image } from './graphql/images.graphql.schema';
import { ImagesService } from './images.service';
// import { CreateImageDto } from './dto/create-image.dto';

// const pubSub = new PubSub();

@Resolver('Image')
export class ImagesResolvers {
  constructor(private readonly imagesService: ImagesService) {}

  @Query()
  @UseGuards(JwtAuthGuard)
  async allImages(
    @Args('skip') skip?: number,
    @Args('limit') limit?: number,
    @Args('search') search?: string,
  ) {
    return await this.imagesService.findAll(skip, limit, search);
  }

  @Query('_allImagesMeta')
  @UseGuards(JwtAuthGuard)
  async _allImagesMeta() {
    return await this.imagesService.countAll();
  }

  @Query('image')
  @UseGuards(JwtAuthGuard)
  async findOneById(@Args('id', ParseIntPipe) id: number): Promise<Image> {
    return await this.imagesService.findOne(id);
  }

  @Query('findImgUrlsByIds')
  @UseGuards(JwtAuthGuard)
  async findImgUrlsById(@Args('ids') ids: [number]): Promise<object> {
    return await this.imagesService.findCocoUrlsFromImageIDs(ids);
  }

  // @Mutation('createCat')
  // async create(@Args('createCatInput') args: CreateCatDto): Promise<Cat> {
  //   const createdCat = await this.imagesService.create(args);
  //   // pubSub.publish('catCreated', { catCreated: createdCat });
  //   return createdCat;
  // }

  // @Subscription('onChangeImage')
  // catCreated() {
  //   return {
  //     subscribe: () => pubSub.asyncIterator('onChangeImage'),
  //   };
  // }
}
