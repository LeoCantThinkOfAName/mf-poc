import {
  IsEmail,
  IsLatitude,
  IsLongitude,
  IsMilitaryTime,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsPhoneNumber('TW')
  tel: string;

  @IsEmail()
  email: string;

  @IsString()
  owner: string;

  @IsMilitaryTime()
  @IsOptional()
  opening: number;

  @IsMilitaryTime()
  @IsOptional()
  closing: number;

  @IsString()
  address: string;

  @ValidateNested({ each: true })
  location: {
    type: 'Point';
    coordinates: number[];
  };

  @IsString()
  img: string;
}
