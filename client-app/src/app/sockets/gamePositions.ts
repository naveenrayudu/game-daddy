import { DaddyGameTypes } from "../common/types";
import { Store } from "redux";

export default (socket: SocketIOClient.Socket, store: Store) => {
    const updateUserPlays = (playerId: number, roomId: string, index: number, currentGamePositions: {
        [playerId:number] : number[]
    }, pawnsInfo: {
        [playerId:number] : {
            availablePawns: number,
            unavailablePawns: number
        }
    }) => {
        socket.emit("callServerToUpdateInsertPositions", roomId, playerId, index, currentGamePositions || {}, pawnsInfo);
    }

    socket.on("callClientToUpdatePlayerPositions", (gamePositions: {
        [playerId:number] : number[]
    }
    ,currentPlayerId: number
    ,pawnsInfo: {
        [playerId:number] : {
            availablePawns: number,
            unavailablePawns: number
        }
    },
    isDaddy: boolean,
    positionsToDelete: number[]) => {
        debugger;
        store.dispatch({
            type: DaddyGameTypes.UPDATE_GAME_POSITIONS,
            payload: {
                gamePositions,
                currentPlayerId,
                pawnsInfo,
                isDaddy,
                positionsToDelete
            } 
        })
    });

    const deleteUserPawns = (playerId: number, roomId: string, index: number, currentGamePositions: {
        [playerId:number] : number[]
    }, pawnsInfo: {
        [playerId:number] : {
            availablePawns: number,
            unavailablePawns: number
        }
    }) => {
        socket.emit("deletePlayerPawns", roomId, playerId, index, currentGamePositions || {}, pawnsInfo);
    }

    const moveUserPlays = (playerId: number, roomId: string, oldIndex: number, newIndex: number, currentGamePositions: {
        [playerId:number] : number[]
    }, pawnsInfo: {
        [playerId:number] : {
            availablePawns: number,
            unavailablePawns: number
        }
    }) => {
        socket.emit("callServerToMovePositions", roomId, playerId, oldIndex, newIndex, currentGamePositions || {}, pawnsInfo);
    }


    return {
        updateUserPlays,
        deleteUserPawns,
        moveUserPlays
    }
}