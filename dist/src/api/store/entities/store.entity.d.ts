import { Point } from 'geojson';
export declare class Store {
    id: string;
    name: string;
    tel: string;
    email: string;
    opening: string;
    closing: string;
    address: string;
    location: Point;
    img: string;
    createdAt: Date;
    deletedAt: Date;
    updatedAt: Date;
}
