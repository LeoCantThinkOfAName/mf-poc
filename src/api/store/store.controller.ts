import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Point } from 'geojson';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreService } from './store.service';

@Controller('api/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  findNearest(@Body() location: Point) {
    return this.storeService.findNearest(location);
  }

  @Get()
  findByName(@Param('name') name: string) {
    return this.storeService.findByName(name);
  }

  @Post('/create')
  createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.createStore(createStoreDto);
  }
}
