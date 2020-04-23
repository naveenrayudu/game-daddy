"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameHelper_1 = __importDefault(require("../helpers/gameHelper"));
const gameUpdates = (io, redisClient) => {
    const gameNameSpace = '/daddy';
    const daddyPlayers = 2;
    const insertGamePawns = (roomId, playerId, index) => {
        const insertGamePawnsCalBack = (gameInfo) => {
            if (!gameInfo.playerPositions[playerId]) {
                gameInfo.playerPositions[playerId] = [index];
            }
            else {
                gameInfo.playerPositions[playerId].push(index);
            }
            if (gameInfo.pawnsInfo[playerId]) {
                gameInfo.pawnsInfo[playerId].availablePawns = gameInfo.pawnsInfo[playerId].availablePawns - 1;
            }
            updateClientForPawnPositions({
                playerId,
                index,
                gameInfo,
                added: index,
                deleted: undefined
            });
        };
        redisClient.get(roomId, (err, value) => {
            if (err)
                return;
            insertGamePawnsCalBack(JSON.parse(value));
        });
    };
    const moveGamePawns = (roomId, playerId, oldIndex, newIndex) => {
        const moveGamePawnsCalBack = (gameInfo) => {
            gameInfo.playerPositions[playerId] = gameInfo.playerPositions[playerId].filter(t => t !== oldIndex);
            gameInfo.playerPositions[playerId].push(newIndex);
            updateClientForPawnPositions({
                playerId,
                index: newIndex,
                gameInfo,
                added: newIndex,
                deleted: oldIndex
            });
        };
        redisClient.get(roomId, (err, value) => {
            if (err)
                return;
            moveGamePawnsCalBack(JSON.parse(value));
        });
    };
    const updateClientForPawnPositions = (info) => {
        // check if the position placed is a daddy.
        const isDaddy = gameHelper_1.default.checkIfPositionIsInDaddy(info.index, info.gameInfo.playerPositions[info.playerId]);
        let updatedPlayerId = info.playerId % daddyPlayers + 1;
        let positionsToDelete = [];
        if (isDaddy) {
            updatedPlayerId = info.playerId;
            positionsToDelete = gameHelper_1.default.getPositionsThatCanBeDeletedByPlayer(info.playerId, info.gameInfo.playerPositions);
        }
        info.gameInfo.currentPlayerId = updatedPlayerId;
        const clientProps = Object.assign({}, info, { isDaddy: isDaddy, updatedPlayerId: updatedPlayerId, positionsToDelete: positionsToDelete });
        informClientOfTheirPawnUpdates(clientProps);
    };
    const deletePlayerPawns = (roomId, playerId, index) => {
        const deleteGamePawnsCalBack = (gameInfo) => {
            const updatedPlayerId = playerId % daddyPlayers + 1;
            gameInfo.playerPositions[updatedPlayerId] = gameInfo.playerPositions[updatedPlayerId].filter(t => t !== index);
            gameInfo.pawnsInfo[updatedPlayerId].unavailablePawns = gameInfo.pawnsInfo[updatedPlayerId].unavailablePawns + 1;
            const clientProps = {
                isDaddy: false,
                updatedPlayerId: updatedPlayerId,
                positionsToDelete: [],
                playerId: playerId,
                gameInfo: gameInfo,
                index: index,
                deleted: index
            };
            informClientOfTheirPawnUpdates(clientProps);
        };
        redisClient.get(roomId, (err, value) => {
            if (err)
                return;
            deleteGamePawnsCalBack(JSON.parse(value));
        });
    };
    const informClientOfTheirPawnUpdates = (clientProps) => {
        const clientPropsToPass = {
            newPlayerId: clientProps.updatedPlayerId,
            playerPositions: clientProps.gameInfo.playerPositions,
            pawnsInfo: clientProps.gameInfo.pawnsInfo,
            isDaddy: false,
            positionsToDelete: clientProps.positionsToDelete,
            added: clientProps.added,
            deleted: clientProps.deleted
        };
        // Game won by current playerId
        if (Object.keys(clientProps.gameInfo.pawnsInfo).some(key => clientProps.gameInfo.pawnsInfo[parseInt(key, 10)].unavailablePawns >= 7)) {
            clientPropsToPass.newPlayerId = clientProps.playerId;
            io.of(gameNameSpace).in(clientProps.gameInfo.gameId).emit('callClientToUpdateGameCompletion', clientPropsToPass);
            redisClient.del(clientProps.gameInfo.gameId);
        }
        else {
            io.of(gameNameSpace).in(clientProps.gameInfo.gameId).emit('callClientToUpdatePlayerPositions', clientPropsToPass);
            redisClient.set(clientProps.gameInfo.gameId, JSON.stringify(clientProps.gameInfo));
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