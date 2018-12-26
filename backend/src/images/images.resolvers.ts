import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../shared/auth/auth.guard';
import { User as UserEntity } from '../users/interfaces/user.interface';
import { Image } from './graphql/images.graphql.schema';
import { ImagesService } from './images.service';

import { User as UserDecorator } from '../shared/auth/auth.decorator';

@Resolver('Image')
export class ImagesResolvers {
  constructor(private readonly imagesService: ImagesService) {}

  @Query()
  @UseGuards(JwtAuthGuard)
  async allImages(
    @UserDecorator() user: UserEntity,
    @Args('skip') skip?: number,
    @Args('limit') limit?: number,
    @Args('search') search?: string,
  ) {
    return await this.imagesService.findAll(user, skip, limit, search);
  }

  @Query('_allImagesMeta')
  @UseGuards(JwtAuthGuard)
  async _allImagesMeta() {
    return await this.imagesService.countAll();
  }

  @Query('image')
  @UseGuards(JwtAuthGuard)
  async findOneById(id: number): Promise<Image> {
    return await this.imagesService.findOne(id);
  }

  @Query('findImgUrlsByIds')
  @UseGuards(JwtAuthGuard)
  async findImgUrlsById(@Args('ids') ids: [number]): Promise<object> {
    return await this.imagesService.findCocoUrlsFromImageIDs(ids);
  }
}
