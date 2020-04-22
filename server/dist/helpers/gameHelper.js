"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gridProperties_1 = __importDefault(require("./gridProperties"));
const getPositionsThatCanBeDeletedByPlayer = (playerId, currentGamePositions) => {
    const positionsToDelete = [];
    const otherPlayerId = Object.keys(currentGamePositions).map(t => parseInt(t, 10)).find(t => t !== playerId);
    if (otherPlayerId && currentGamePositions[otherPlayerId]) {
        const otherPlayerPositions = currentGamePositions[otherPlayerId];
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
exports.default = {
    getPositionsThatCanBeDeletedByPlayer,
    checkIfPositionIsInDaddy
};
//# sourceMappingURL=gameHelper.js.map