"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreFactory = void 0;
const typeorm_seeding_1 = require("typeorm-seeding");
const store_entity_1 = require("../entities/store.entity");
exports.StoreFactory = (0, typeorm_seeding_1.define)(store_entity_1.Store, (faker) => {
    const store = new store_entity_1.Store();
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
    };
    store.img = faker.image.animals();
    return store;
});
//# sourceMappingURL=store.factory.js.map