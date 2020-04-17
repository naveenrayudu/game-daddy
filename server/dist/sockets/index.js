"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const SocketClient = (httpServer) => {
    const io = socket_io_1.default(httpServer);
    const gameNameSpace = '/daddy';
    const daddyPlayers = 2;
    io.of(gameNameSpace).on("connection", (socket) => {
        socket.on("create", (fn) => createGame(socket, gameNameSpace, daddyPlayers, fn));
        socket.on("join", (room, fn) => joinGame(socket, gameNameSpace, room, daddyPlayers, fn));
        socket.on('leave', (room) => leaveGame(socket, room));
        socket.on('callServerToUpdatePositions', updateGamePositions);
    });
    const createGame = (socket, gameNameSpace, playersCount, fn) => {
        const roomNumber = createRandomRoomNumber();
        joinGame(socket, gameNameSpace, roomNumber, playersCount, fn);
    };
    const joinGame = (socket, gameNameSpace, room, playersCount, fn) => {
        socket.join(room, () => {
            const clientsCount = getRoomClientsCount(gameNameSpace, room);
            const playerIds = [];
            for (let i = 0; i < clientsCount; i++) {
                playerIds.push(i + 1);
            }
            if (fn && typeof (fn) === 'function') {
                fn(room, clientsCount, playerIds);
            }
            // Update existing clients regarding the join.
            socket.in(room).emit("updateclientfornewplayers", playerIds);
            // allow starting the game if all the players joined the game.
            if (clientsCount === playersCount) {
                const currentPlayerId = Math.ceil((Math.random() * 10) / 5);
                io.of(gameNameSpace).in(room).emit("startgame", currentPlayerId);
            }
        });
    };
    const updateGamePositions = (roomId, playerId, index, currentGamePositions) => {
        if (!currentGamePositions[playerId]) {
            currentGamePositions[playerId] = [index];
        }
        else {
            currentGamePositions = Object.assign(Object.assign({}, currentGamePositions), { [playerId]: [...currentGamePositions[playerId], index] });
        }
        io.of(gameNameSpace).in(roomId).emit('callClientToUpdatePlayerPositions', currentGamePositions, playerId % daddyPlayers + 1);
    };
    const leaveGame = (socket, room) => {
        if (Object.keys(socket.rooms).indexOf(room) === -1) {
            return;
        }
        socket.leave(room);
    };
    const createRandomRoomNumber = () => {
        let roomNumber = "";
        for (let i = 0; i < 7; i++) {
            roomNumber = roomNumber + Math.ceil(Math.random() * 9).toString();
        }
        return roomNumber;
    };
    const getRoomClientsCount = (gameNameSpace, room) => {
        return io.of(gameNameSpace).adapter.rooms[room].length;
    };
    return io;
};
exports.default = SocketClient;
//# sourceMappingURL=index.js.map