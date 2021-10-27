"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let StoreService = class StoreService {
    constructor(connection) {
        this.connection = connection;
    }
    async findNearest(location) {
        const stores = await this.connection.manager.query(`
      SELECT *
      FROM store

      WHERE ST_DWithin(
        Geography(location),
        Geography(ST_MakePoint(${location.coordinates[0]}, ${location.coordinates[1]})),
        500
      )
      ORDER by location <-> ST_MakePoint(${location.coordinates[0]}, ${location.coordinates[1]})
      LIMIT 10;
    `);
        return stores;
    }
    findByName(name) {
        return this.connection.getRepository('store').find({ name });
    }
    createStore(createStoreDto) {
        return this.connection.getRepository('store').save(createStoreDto);
    }
};
StoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.Connection])
], StoreService);
exports.StoreService = StoreService;
//# sourceMappingURL=store.service.js.map