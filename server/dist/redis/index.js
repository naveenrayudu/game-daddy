"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const socket_io_redis_1 = __importDefault(require("socket.io-redis"));
const redisOptions = {
    port: parseInt(process.env.REDIS_PORT, 10),
    host: process.env.REDIS_ENDPOINT,
    password: process.env.REDIS_PASSWORD
};
const redisClient = redis_1.default.createClient(redisOptions);
const pubClient = redis_1.default.createClient(redisOptions);
const subClient = redis_1.default.createClient(redisOptions);
const redisAdapter = socket_io_redis_1.default({
    pubClient: pubClient,
    subClient: subClient
});
exports.default = {
    redisClient,
    redisAdapter
};
//# sourceMappingURL=index.js.map