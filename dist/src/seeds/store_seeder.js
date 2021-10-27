"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_entity_1 = require("../api/store/entities/store.entity");
class CreateStores {
    async run(factory) {
        await factory(store_entity_1.Store)().createMany(5000);
    }
}
exports.default = CreateStores;
//# sourceMappingURL=store_seeder.js.map