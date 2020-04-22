"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const room_1 = __importDefault(require("./room"));
const gameUpdates_1 = __importDefault(require("./gameUpdates"));
const SocketClient = (httpServer, redis) => {
    let io = socket_io_1.default(httpServer);
    io = io.adapter(redis.redisAdapter);
    const gameNameSpace = '/daddy';
    const { createRedisRoom, joinRedisRoom, leaveRedisRoom, disconnectRedisRoom } = room_1.default(io, redis.redisClient);
    const { insertGamePawns, moveGamePawns, deletePlayerPawns } = gameUpdates_1.default(io);
    io.of(gameNameSpace).on("connection", (socket) => {
        socket.on("create", (fn) => createRedisRoom(socket, fn));
        socket.on("join", (room, fn) => joinRedisRoom(socket, room, fn));
        socket.on('leave', (room, fn) => leaveRedisRoom(socket, room, fn));
        socket.on('callServerToUpdateInsertPositions', insertGamePawns);
        socket.on('callServerToMovePositions', moveGamePawns);
        socket.on('deletePlayerPawns', deletePlayerPawns);
        socket.on("disconnect", () => disconnectRedisRoom(socket));
    });
    return io;
};
exports.default = SocketClient;
//# sourceMappingURL=index.js.map