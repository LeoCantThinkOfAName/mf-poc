import { Point } from 'geojson';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('store')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  name: string;

  @Column({ nullable: false, type: 'varchar' })
  tel: string;

  @Column({ nullable: false, type: 'varchar' })
  email: string;

  @Column({ nullable: true, type: 'time without time zone' })
  opening: string;

  @Column({ nullable: true, type: 'time without time zone' })
  closing: string;

  @Column({ nullable: false, type: 'text' })
  address: string;

  @Index({ spatial: true })
  @Column({ nullable: false, type: 'geography', spatialFeatureType: 'Point' })
  location: Point;

  @Column({ nullable: false, type: 'varchar' })
  img: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
