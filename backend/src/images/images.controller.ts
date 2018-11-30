import { Controller, Get, Param, Query } from '@nestjs/common';
// import { CreateImageDto } from './dto/create-image.dto';
import { ImagesService } from './images.service';
import { Image } from './interfaces/image.interface';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  // @Post()
  // async create(@Body() createCatDto: CreateImageDto) {
  //   this.catsService.create(createCatDto);
  // }

  @Get()
  async findAll(@Query() query): Promise<Image[]> {
    return this.imagesService.findAll(Number(query.skip), Number(query.limit));
  }

  @Get(':id')
  async findOne(@Param('id') id): Promise<Image[]> {
    return this.imagesService.findOne(id);
  }
}
