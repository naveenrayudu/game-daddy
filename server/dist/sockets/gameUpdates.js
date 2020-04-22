"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameHelper_1 = __importDefault(require("../helpers/gameHelper"));
const gameUpdates = (io) => {
    const gameNameSpace = '/daddy';
    const daddyPlayers = 2;
    const insertGamePawns = (roomId, playerId, index, currentGamePositions, pawnsInfo) => {
        if (!currentGamePositions[playerId]) {
            currentGamePositions[playerId] = [index];
        }
        else {
            currentGamePositions = Object.assign(Object.assign({}, currentGamePositions), { [playerId]: [...currentGamePositions[playerId], index] });
        }
        if (pawnsInfo[playerId]) {
            pawnsInfo[playerId].availablePawns = pawnsInfo[playerId].availablePawns - 1;
        }
        updateClientForPawnPositions(roomId, playerId, index, currentGamePositions, pawnsInfo);
    };
    const moveGamePawns = (roomId, playerId, oldIndex, newIndex, currentGamePositions, pawnsInfo) => {
        currentGamePositions = Object.assign(Object.assign({}, currentGamePositions), { [playerId]: [...currentGamePositions[playerId].filter(t => t !== oldIndex), newIndex] });
        updateClientForPawnPositions(roomId, playerId, newIndex, currentGamePositions, pawnsInfo);
    };
    const updateClientForPawnPositions = (roomId, playerId, index, currentGamePositions, pawnsInfo) => {
        // check if the position placed is a daddy.
        const isDaddy = gameHelper_1.default.checkIfPositionIsInDaddy(index, currentGamePositions[playerId]);
        let updatedPlayerId = playerId % daddyPlayers + 1;
        let positionsToDelete = [];
        if (isDaddy) {
            updatedPlayerId = playerId;
            positionsToDelete = gameHelper_1.default.getPositionsThatCanBeDeletedByPlayer(playerId, currentGamePositions);
        }
        informClientOfTheirPawnUpdates(roomId, playerId, currentGamePositions, pawnsInfo, isDaddy, updatedPlayerId, positionsToDelete);
    };
    const deletePlayerPawns = (roomId, playerId, index, currentGamePositions, pawnsInfo) => {
        const otherPlayerId = playerId % daddyPlayers + 1;
        const updatedOtherPlayerPosition = currentGamePositions[otherPlayerId].filter(t => t !== index);
        const updatedOtherPlayersPawnsInfo = Object.assign(Object.assign({}, pawnsInfo[otherPlayerId]), { unavailablePawns: pawnsInfo[otherPlayerId].unavailablePawns + 1 });
        const newPositions = Object.assign(Object.assign({}, currentGamePositions), { [otherPlayerId]: updatedOtherPlayerPosition });
        const updatedPawns = Object.assign(Object.assign({}, pawnsInfo), { [otherPlayerId]: updatedOtherPlayersPawnsInfo });
        informClientOfTheirPawnUpdates(roomId, playerId, newPositions, updatedPawns, false, otherPlayerId, []);
    };
    const informClientOfTheirPawnUpdates = (roomId, currentPlayerId, currentGamePositions, pawnsInfo, isDaddy, updatedPlayerId, positionsToDelete) => {
        // Game won by current playerId
        if (Object.keys(pawnsInfo).some(key => pawnsInfo[parseInt(key, 10)].unavailablePawns >= 7)) {
            io.of(gameNameSpace).in(roomId).emit('callClientToUpdateGameCompletion', currentGamePositions, currentPlayerId, pawnsInfo, isDaddy);
        }
        else {
            io.of(gameNameSpace).in(roomId).emit('callClientToUpdatePlayerPositions', currentGamePositions, updatedPlayerId, pawnsInfo, isDaddy, positionsToDelete);
        }
    };
    return {
        insertGamePawns,
        moveGamePawns,
        deletePlayerPawns
    };
};
exports.default = gameUpdates;
//# sourceMappingURL=gameUpdates.js.map