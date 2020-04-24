"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const constants_1 = require("../constants");
const createOrUpdateRoom = (room, socketId) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const db = yield _1.getDb();
        const updateOneRequest = yield db.collection(constants_1.ROOM_COLLECTIONS).updateOne({ roomId: room }, {
            $setOnInsert: {
                roomId: room
            },
            $push: {
                sockets: socketId
            }
        }, { upsert: true });
        if (updateOneRequest.result.ok)
            return resolve();
        return reject('Error updating the document');
    }));
});
exports.createOrUpdateRoom = createOrUpdateRoom;
const saveGameInfoToRoom = (room, gameInfo) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const db = yield _1.getDb();
        const updateOneRequest = yield db.collection(constants_1.ROOM_COLLECTIONS).updateOne({ roomId: room }, {
            $setOnInsert: {
                roomId: room
            },
            $set: {
                gameInfo: gameInfo
            }
        }, { upsert: true });
        if (updateOneRequest.result.ok)
            return resolve();
        return reject('Error updating the document');
    }));
});
exports.saveGameInfoToRoom = saveGameInfoToRoom;
//# sourceMappingURL=createRoom.js.map