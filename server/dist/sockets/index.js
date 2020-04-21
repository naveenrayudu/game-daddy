"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const gridProperties_1 = __importDefault(require("../helpers/gridProperties"));
const SocketClient = (httpServer) => {
    const io = socket_io_1.default(httpServer);
    const gameNameSpace = '/daddy';
    const daddyPlayers = 2;
    io.of(gameNameSpace).on("connection", (socket) => {
        socket.on("create", (fn) => createGame(socket, gameNameSpace, daddyPlayers, fn));
        socket.on("join", (room, fn) => joinGame(socket, gameNameSpace, room, daddyPlayers, fn));
        socket.on('leave', (room, fn) => leaveGame(socket, room, fn));
        socket.on('callServerToUpdatePositions', updateGamePositions);
        socket.on('callServerToMovePositions', moveGamePositions);
        socket.on('deletePlayerPawns', deletePlayerPawns);
        socket.on("disconnect", () => {
            console.log(socket.rooms);
            Object.keys(socket.rooms).forEach((room) => {
                socket.in(room).emit('clientClosedBrowser');
            });
        });
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
    const updateGamePositions = (roomId, playerId, index, currentGamePositions, pawnsInfo) => {
        if (!currentGamePositions[playerId]) {
            currentGamePositions[playerId] = [index];
        }
        else {
            currentGamePositions = Object.assign(Object.assign({}, currentGamePositions), { [playerId]: [...currentGamePositions[playerId], index] });
        }
        if (pawnsInfo[playerId]) {
            pawnsInfo[playerId].availablePawns = pawnsInfo[playerId].availablePawns - 1;
        }
        updateClientForPlayerPositions(roomId, playerId, index, currentGamePositions, pawnsInfo);
    };
    const moveGamePositions = (roomId, playerId, oldIndex, newIndex, currentGamePositions, pawnsInfo) => {
        currentGamePositions = Object.assign(Object.assign({}, currentGamePositions), { [playerId]: [...currentGamePositions[playerId].filter(t => t !== oldIndex), newIndex] });
        updateClientForPlayerPositions(roomId, playerId, newIndex, currentGamePositions, pawnsInfo);
    };
    const updateClientForPlayerPositions = (roomId, playerId, index, currentGamePositions, pawnsInfo) => {
        // check if the position placed is a daddy.
        const isDaddy = checkIfPositionIsInDaddy(index, currentGamePositions[playerId]);
        let updatedPlayerId = playerId % daddyPlayers + 1;
        let positionsToDelete = [];
        if (isDaddy) {
            updatedPlayerId = playerId;
            positionsToDelete = getPositionsThatCanBeDeletedByPlayer(playerId, currentGamePositions);
        }
        // Game won by current playerId
        if (Object.keys(pawnsInfo).some(key => pawnsInfo[parseInt(key, 10)].availablePawns < 3)) {
            io.of(gameNameSpace).in(roomId).emit('callClientToUpdateGameCompletion', currentGamePositions, playerId, pawnsInfo, isDaddy);
        }
        else {
            io.of(gameNameSpace).in(roomId).emit('callClientToUpdatePlayerPositions', currentGamePositions, updatedPlayerId, pawnsInfo, isDaddy, positionsToDelete);
        }
    };
    const deletePlayerPawns = (roomId, playerId, index, currentGamePositions, pawnsInfo) => {
        const otherPlayerId = playerId % daddyPlayers + 1;
        const updatedOtherPlayerPosition = currentGamePositions[otherPlayerId].filter(t => t !== index);
        const updatedOtherPlayersPawnsInfo = Object.assign(Object.assign({}, pawnsInfo[otherPlayerId]), { unavailablePawns: pawnsInfo[otherPlayerId].unavailablePawns + 1 });
        const newPositions = Object.assign(Object.assign({}, currentGamePositions), { [otherPlayerId]: updatedOtherPlayerPosition });
        const updatedPawns = Object.assign(Object.assign({}, pawnsInfo), { [otherPlayerId]: updatedOtherPlayersPawnsInfo });
        io.of(gameNameSpace).in(roomId).emit('callClientToUpdatePlayerPositions', newPositions, otherPlayerId, updatedPawns, false, []);
    };
    const leaveGame = (socket, room, fn) => {
        if (Object.keys(socket.rooms).indexOf(room) === -1) {
            return;
        }
        socket.leave(room, () => {
            if (fn && typeof fn === 'function') {
                fn();
            }
            if (getRoomClientsCount(gameNameSpace, room) > 0) {
                socket.in(room).emit('updateClientForOtherPlayerLeftRoom');
            }
        });
    };
    const createRandomRoomNumber = () => {
        let roomNumber = "";
        for (let i = 0; i < 7; i++) {
            roomNumber = roomNumber + Math.ceil(Math.random() * 9).toString();
        }
        return roomNumber;
    };
    const getRoomClientsCount = (gameNameSpace, room) => {
        if (io.of(gameNameSpace).adapter.rooms[room])
            return io.of(gameNameSpace).adapter.rooms[room].length;
        return 0;
    };
    const getPositionsThatCanBeDeletedByPlayer = (playerId, currentGamePositions) => {
        debugger;
        const positionsToDelete = [];
        const otherPlayerId = Object.keys(currentGamePositions).find(t => t !== playerId.toString());
        if (otherPlayerId && currentGamePositions[parseInt(otherPlayerId, 10)]) {
            const otherPlayerPositions = currentGamePositions[parseInt(otherPlayerId, 10)];
            otherPlayerPositions.forEach((t => {
                if (!checkIfPositionIsInDaddy(t, otherPlayerPositions)) {
                    positionsToDelete.push(t);
                }
            }));
            // if there are no valid positions to delete, then allow any positions to delete
            if (positionsToDelete.length === 0) {
                otherPlayerPositions.forEach(t => {
                    positionsToDelete.push(t);
                });
            }
        }
        return positionsToDelete;
    };
    const checkIfPositionIsInDaddy = (position, currentPlayerPositions) => {
        const validDaddyPosition = gridProperties_1.default.scorePointsByIndex[position];
        if (!currentPlayerPositions || !validDaddyPosition)
            return false;
        return validDaddyPosition.some((validPosition) => {
            return validPosition.every(t => currentPlayerPositions.indexOf(t) !== -1);
        });
    };
    return io;
};
exports.default = SocketClient;
//# sourceMappingURL=index.js.map