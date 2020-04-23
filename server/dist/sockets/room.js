"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameHelper_1 = __importDefault(require("../helpers/gameHelper"));
const socketIORoomHandler = (io, redisClient) => {
    const gameNameSpace = '/daddy';
    const daddyPlayers = 2;
    const redisAdapter = io.of(gameNameSpace).adapter;
    const joinRedisRoom = (socket, room, callback) => {
        redisAdapter.remoteJoin(socket.id, room, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            // Save the socket client room.
            addRoomToSocket(socket.id, room);
            const clientsCount = getRoomClientsCount(room);
            const playerIds = [];
            for (let i = 0; i < clientsCount; i++) {
                playerIds.push(i + 1);
            }
            if (callback && typeof (callback) === 'function') {
                callback(room, clientsCount, playerIds);
            }
            // Update existing clients regarding the join.
            socket.in(room).emit("updateclientfornewplayers", playerIds);
            // allow starting the game if all the players joined the game.
            if (clientsCount === daddyPlayers) {
                const currentPlayerId = Math.ceil((Math.random() * 10) / 5);
                const gameInfo = gameHelper_1.default.createEmptyGameModel(room, playerIds, currentPlayerId);
                redisClient.set(room, JSON.stringify(gameInfo), () => {
                    io.of(gameNameSpace).in(room).emit("startGame", gameInfo);
                });
            }
        });
    };
    const createRedisRoom = (socket, callback) => {
        const roomNumber = createRandomRoomNumber();
        joinRedisRoom(socket, roomNumber, callback);
    };
    const leaveRedisRoom = (socket, room, callback) => {
        redisAdapter.remoteLeave(socket.id, room, () => {
            if (callback && typeof callback === 'function') {
                callback();
            }
            removeRoomFromSocket(socket.id, room);
            if (getRoomClientsCount(room) > 0) {
                // By doing this we will emit only when the game is incomplete..
                redisClient.get(room, (err, gameInfo) => {
                    if (gameInfo)
                        emitSocketActions(room, 'updateClientForOtherPlayerLeftRoom');
                });
            }
        });
    };
    const disconnectRedisRoom = (socket) => {
        const remoteDisconnectCallback = (rooms) => {
            //Inform users regarding the users leaving the room
            rooms.forEach(room => {
                emitSocketActions(room, 'clientClosedBrowser');
            });
        };
        redisClient.get(socket.id, (err, room) => {
            if (err)
                return;
            remoteDisconnectCallback(JSON.parse(room) || []);
            redisClient.del(socket.id);
        });
    };
    const addRoomToSocket = (socketId, room) => {
        redisClient.get(socketId, (err, res) => {
            if (err) {
                redisClient.set(socketId, JSON.stringify([room]));
                return;
            }
            const currentRooms = JSON.parse(res) || [];
            currentRooms.push(room);
            redisClient.set(socketId, JSON.stringify(currentRooms), (err) => {
                if (err)
                    console.log(err);
            });
        });
    };
    const removeRoomFromSocket = (socketId, room) => {
        redisClient.get(socketId, (err, res) => {
            if (err) {
                return;
            }
            const currentRooms = (JSON.parse(res) || []).filter(t => t !== room);
            if (currentRooms.length === 0)
                redisClient.del(socketId);
            else {
                redisClient.set(socketId, JSON.stringify(currentRooms));
            }
        });
    };
    const emitSocketActions = (room, emitName) => {
        io.of(gameNameSpace).in(room).emit(emitName);
    };
    const createRandomRoomNumber = () => {
        let roomNumber = "";
        for (let i = 0; i < 7; i++) {
            roomNumber = roomNumber + Math.ceil(Math.random() * 9).toString();
        }
        return roomNumber;
    };
    const getRoomClientsCount = (room) => {
        return redisAdapter.rooms[room] ? redisAdapter.rooms[room].length : 0;
    };
    return {
        createRedisRoom,
        joinRedisRoom,
        leaveRedisRoom,
        disconnectRedisRoom
    };
};
exports.default = socketIORoomHandler;
//# sourceMappingURL=room.js.map