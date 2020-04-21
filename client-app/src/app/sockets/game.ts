import { DaddyGameTypes } from "../common/types";
import { Store } from "redux";
import { GameStatusType } from "../common/models/types";

export default (socket: SocketIOClient.Socket, store: Store) => {
    socket.on("startgame", (currentPlayerId: number) => {
        store.dispatch({
            type: DaddyGameTypes.START_GAME,
            payload: {
                currentPlayerId: currentPlayerId,
                canPlayGame: true
            }
        })
    })

    socket.on("updateclientfornewplayers", (players: number[]) => {
        store.dispatch({
            type: DaddyGameTypes.ADD_PLAYERS,
            payload: players
       })
    });

    socket.on("callClientToUpdateGameCompletion", (gamePositions: {
            [playerId:number] : number[]
        },wonBy: number ,pawnsInfo: {
            [playerId:number] : {
                availablePawns: number,
                unavailablePawns: number
            }
        }, isDaddy: boolean) => {
        store.dispatch({
            type: DaddyGameTypes.COMPLETED_GAME,
            payload: {
                gamePositions,
                pawnsInfo,
                isDaddy,
                wonBy,
                type: 'completed' as GameStatusType
            }
        })
    })
}