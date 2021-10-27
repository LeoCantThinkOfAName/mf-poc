import { Store } from '../api/store/entities/store.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateStores implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(Store)().createMany(5000);
  }
}
