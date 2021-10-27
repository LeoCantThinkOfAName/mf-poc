import { Point } from 'geojson';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreService } from './store.service';
export declare class StoreController {
    private readonly storeService;
    constructor(storeService: StoreService);
    findNearest(location: Point): Promise<any>;
    findByName(name: string): Promise<unknown[]>;
    createStore(createStoreDto: CreateStoreDto): Promise<CreateStoreDto>;
}
