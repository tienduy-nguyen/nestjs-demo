"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoConfig = void 0;
const path_1 = require("path");
exports.mongoConfig = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [path_1.join(__dirname, '**', '*.entity.{ts,js}')],
    synchronize: true,
};
//# sourceMappingURL=mongoConfig.js.map