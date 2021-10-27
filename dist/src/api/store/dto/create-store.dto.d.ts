export declare class CreateStoreDto {
    name: string;
    tel: string;
    email: string;
    owner: string;
    opening: number;
    closing: number;
    address: string;
    location: {
        type: 'Point';
        coordinates: number[];
    };
    img: string;
}
