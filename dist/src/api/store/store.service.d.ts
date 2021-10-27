import { Point } from 'geojson';
import { Connection } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
export declare class StoreService {
    private connection;
    constructor(connection: Connection);
    findNearest(location: Point): Promise<any>;
    findByName(name: string): Promise<unknown[]>;
    createStore(createStoreDto: CreateStoreDto): Promise<CreateStoreDto>;
}
