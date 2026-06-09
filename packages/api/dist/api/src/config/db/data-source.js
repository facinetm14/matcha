"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = exports.pgClient = void 0;
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
exports.pgClient = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT ?? '5432'),
    database: process.env.POSTGRES_DB,
});
const dbConnect = async () => {
    return exports.pgClient.connect();
};
exports.dbConnect = dbConnect;
