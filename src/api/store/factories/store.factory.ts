import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { Store } from '../entities/store.entity';

export const StoreFactory = define(Store, (faker: typeof Faker) => {
  const store = new Store();
  store.name = faker.company.companyName();
  store.tel = faker.phone.phoneNumber();
  store.email = faker.internet.email();
  store.opening = faker.helpers.randomize(['09:00', '10:00', '11:00']);
  store.closing = faker.helpers.randomize(['21:00', '22:00', '24:00']);
  store.address = faker.address.city() + faker.address.streetName();

  store.location = {
    type: 'Point',
    coordinates: [
      +faker.address.longitude(121.6100438, 121.538976, 10),
      +faker.address.latitude(25.092366, 24.9758704, 10),
    ],
    // faker.address
    // .nearbyGPSCoordinate(['25.024342964781432', '121.55259964203142'], 5)
    // .map((coord) => +coord)
    // .reverse(),
  };
  store.img = faker.image.animals();
  return store;
});
