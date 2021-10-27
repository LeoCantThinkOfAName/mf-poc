import { Injectable } from '@nestjs/common';
import { Point } from 'geojson';
import { Connection } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoreService {
  constructor(private connection: Connection) {}

  async findNearest(location: Point) {
    const stores = await this.connection.manager.query(`
      SELECT *
      FROM store

      WHERE ST_DWithin(
        Geography(location),
        Geography(ST_MakePoint(${location.coordinates[0]}, ${location.coordinates[1]})),
        500
      )
      ORDER by location <-> ST_MakePoint(${location.coordinates[0]}, ${location.coordinates[1]})
      LIMIT 10;
    `);
    return stores;
  }

  findByName(name: string) {
    return this.connection.getRepository('store').find({ name });
  }

  createStore(createStoreDto: CreateStoreDto) {
    return this.connection.getRepository('store').save(createStoreDto);
  }
}
