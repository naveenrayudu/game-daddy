import { DaddyGameTypes } from "../common/types";
import { Store } from "redux";
import { IPlayerPositions, IPawnsInfo, IClientUpdateProps } from "../common/models/redux-state";

export default (socket: SocketIOClient.Socket, store: Store) => {
    const submitUserInsertPlays = (playerId: number, roomId: string, index: number, currentGamePositions: IPlayerPositions, pawnsInfo: IPawnsInfo) => {
      
       const updatedGamePositions = {...currentGamePositions};
       if(!updatedGamePositions[playerId]) {
            updatedGamePositions[playerId] = [index];
       } else {
            updatedGamePositions[playerId].push(index);
       }

       const updatedPawnsInfo = {...pawnsInfo};
       updatedPawnsInfo[playerId].availablePawns = updatedPawnsInfo[playerId].availablePawns - 1;

        store.dispatch({
            type: DaddyGameTypes.UPDATE_GAME_POSITIONS,
            payload: {
                newPlayerId: 0,
                playerPositions: updatedGamePositions,
                pawnsInfo: updatedPawnsInfo,
                added: index,
                isDaddy: false,
                positionsToDelete: []
            } as IClientUpdateProps
        });

        socket.emit("callServerToUpdateInsertPositions", roomId, playerId, index);

    }

    socket.on("callClientToUpdatePlayerPositions", (payload: IClientUpdateProps) => {
        store.dispatch({
            type: DaddyGameTypes.UPDATE_GAME_POSITIONS,
            payload
        })
    });

    const deleteUserPawns = (playerId: number, roomId: string, index: number, currentGamePositions: IPlayerPositions, pawnsInfo: IPawnsInfo) => {
        const otherPlayerId = Object.keys(currentGamePositions).map(t => parseInt(t, 10)).find(t => t !== playerId);
        
        const updatedGamePositions = {...currentGamePositions};
        const updatedPawnsInfo = {...pawnsInfo};
        if(otherPlayerId) {
            updatedGamePositions[otherPlayerId] = updatedGamePositions[otherPlayerId].filter(t => t !== index);
            updatedPawnsInfo[otherPlayerId].availablePawns = updatedPawnsInfo[playerId].unavailablePawns + 1;
        }

        store.dispatch({
            type: DaddyGameTypes.UPDATE_GAME_POSITIONS,
            payload: {
                newPlayerId: 0,
                playerPositions: updatedGamePositions,
                pawnsInfo: updatedPawnsInfo,
                isDaddy: false,
                deleted: index,
                positionsToDelete: []
            } as IClientUpdateProps
        });
        
        socket.emit("deletePlayerPawns", roomId, playerId, index);
    }

    const moveUserPlays = (playerId: number, roomId: string, oldIndex: number, newIndex: number, currentGamePositions: {
        [playerId:number] : number[]
    }, pawnsInfo: {
        [playerId:number] : {
            availablePawns: number,
            unavailablePawns: number
        }
    }) => {
        
        const updatedGamePositions = {...currentGamePositions};
        const updatedPawnsInfo = {...pawnsInfo};
       
        updatedGamePositions[playerId] = updatedGamePositions[playerId].filter(t => t !== oldIndex);
        updatedGamePositions[playerId].push(newIndex);

        store.dispatch({
            type: DaddyGameTypes.UPDATE_GAME_POSITIONS,
            payload: {
                newPlayerId: 0,
                playerPositions: updatedGamePositions,
                pawnsInfo: updatedPawnsInfo,
                isDaddy: false,
                positionsToDelete: [],
                deleted: oldIndex,
                added: newIndex
            } as IClientUpdateProps
        });


        socket.emit("callServerToMovePositions", roomId, playerId, oldIndex, newIndex);
    }


    return {
        submitUserInsertPlays,
        deleteUserPawns,
        moveUserPlays
    }
}