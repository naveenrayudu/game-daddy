import gameHelper from '../helpers/gameHelper';


const gameUpdates = (io: SocketIO.Server) => {
    const gameNameSpace = '/daddy';
    const daddyPlayers = 2;

    const insertGamePawns = (roomId: string, playerId: number, index: number, currentGamePositions: {
        [playerId:number] : number[]
    }, pawnsInfo: {
        [playerId:number] : {
            availablePawns: number,
            unavailablePawns: number
        }
    }) => {

        if(!currentGamePositions[playerId]) {
            currentGamePositions[playerId] = [index];
        } else {
            currentGamePositions = {...currentGamePositions, [playerId]: [...currentGamePositions[playerId], index] }
        }

        if(pawnsInfo[playerId]) {
            pawnsInfo[playerId].availablePawns = pawnsInfo[playerId].availablePawns - 1;
        }

        updateClientForPawnPositions(roomId, playerId, index, currentGamePositions, pawnsInfo);
       
    }

    const moveGamePawns = (roomId: string, playerId: number, oldIndex: number, newIndex: number, currentGamePositions: {
        [playerId:number] : number[]
    }, pawnsInfo: {
        [playerId:number] : {
            availablePawns: number,
            unavailablePawns: number
        }
    }) => {
        currentGamePositions = {...currentGamePositions, [playerId]: [...currentGamePositions[playerId].filter(t => t !== oldIndex), newIndex] }
        updateClientForPawnPositions(roomId, playerId, newIndex, currentGamePositions, pawnsInfo);
    }


    const updateClientForPawnPositions = (roomId: string, playerId: number, index: number, currentGamePositions: {
        [playerId:number] : number[]
    }, pawnsInfo: {
        [playerId:number] : {
            availablePawns: number,
            unavailablePawns: number
        }
    }) => {

        // check if the position placed is a daddy.
        const isDaddy = gameHelper.checkIfPositionIsInDaddy(index, currentGamePositions[playerId]);

        let updatedPlayerId = playerId % daddyPlayers + 1;
        let positionsToDelete: number[] = [];
        if(isDaddy)
        {
            updatedPlayerId = playerId;
            positionsToDelete = gameHelper.getPositionsThatCanBeDeletedByPlayer(playerId, currentGamePositions);
        }

        informClientOfTheirPawnUpdates(roomId, playerId, currentGamePositions, pawnsInfo, isDaddy, updatedPlayerId, positionsToDelete);
    }

    const deletePlayerPawns = (roomId: string, playerId: number, index: number, currentGamePositions: {
        [playerId:number] : number[]
    }, pawnsInfo: {
        [playerId:number] : {
            availablePawns: number,
            unavailablePawns: number
        }
    }) => {
        const otherPlayerId = playerId % daddyPlayers + 1;
        const updatedOtherPlayerPosition = currentGamePositions[otherPlayerId].filter(t => t !== index);
        const updatedOtherPlayersPawnsInfo = {...pawnsInfo[otherPlayerId], unavailablePawns: pawnsInfo[otherPlayerId].unavailablePawns + 1 };
        const newPositions = {...currentGamePositions, [otherPlayerId]:updatedOtherPlayerPosition};
        const updatedPawns = {...pawnsInfo, [otherPlayerId]:updatedOtherPlayersPawnsInfo};


        informClientOfTheirPawnUpdates(roomId, playerId, newPositions, updatedPawns, false, otherPlayerId, []);
    }


    const informClientOfTheirPawnUpdates = (roomId: string, currentPlayerId: number, currentGamePositions: {
        [playerId:number] : number[]
    }, pawnsInfo: {
        [playerId:number] : {
            availablePawns: number,
            unavailablePawns: number
        }
    }, 
    isDaddy: boolean,
    updatedPlayerId: number,
    positionsToDelete: number[]) => {
        // Game won by current playerId
        if(Object.keys(pawnsInfo).some(key => pawnsInfo[parseInt(key, 10)].unavailablePawns >= 7)) {
            io.of(gameNameSpace).in(roomId).emit('callClientToUpdateGameCompletion', currentGamePositions, currentPlayerId, pawnsInfo, isDaddy);
        } else {
            io.of(gameNameSpace).in(roomId).emit('callClientToUpdatePlayerPositions', currentGamePositions, updatedPlayerId, pawnsInfo, isDaddy, positionsToDelete);
        }
    }



    return {
        insertGamePawns,
        moveGamePawns,
        deletePlayerPawns
    }
}

export default gameUpdates