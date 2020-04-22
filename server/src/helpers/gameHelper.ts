import GirdProperties from './gridProperties';

const getPositionsThatCanBeDeletedByPlayer = (playerId: number, currentGamePositions: {
    [playerId:number] : number[]
}): number[] => {
    const positionsToDelete: number[] = [];
    const otherPlayerId = Object.keys(currentGamePositions).map(t => parseInt(t, 10)).find(t => t !== playerId);
    
    if(otherPlayerId && currentGamePositions[otherPlayerId])
    {
        const otherPlayerPositions = currentGamePositions[otherPlayerId];
        otherPlayerPositions.forEach((t => {
            if(!checkIfPositionIsInDaddy(t, otherPlayerPositions)) {
                positionsToDelete.push(t);
            }
        }))

        // if there are no valid positions to delete, then allow any positions to delete
        if(positionsToDelete.length === 0) {
            otherPlayerPositions.forEach(t => {
                positionsToDelete.push(t);
            });
        }
    }

    return positionsToDelete;
}

const checkIfPositionIsInDaddy = (position: number, currentPlayerPositions: number[]): boolean => {
    const validDaddyPosition = GirdProperties.scorePointsByIndex[position];

    if(!currentPlayerPositions || !validDaddyPosition)
        return false;

    return validDaddyPosition.some((validPosition) => {
        return validPosition.every(t => currentPlayerPositions.indexOf(t) !== -1)
    });
}

export default {
    getPositionsThatCanBeDeletedByPlayer,
    checkIfPositionIsInDaddy
}