import { DaddyGameTypes } from "../common/types";
import { Store } from "redux";
import { GameStatusType } from "../common/models/types";
import { IGameInfo, IClientUpdateProps } from "../common/models/redux-state";

export default (socket: SocketIOClient.Socket, store: Store) => {
    socket.on("startGame", (gameInfo: IGameInfo) => {
        store.dispatch({
            type: DaddyGameTypes.START_GAME,
            payload: {
                ...gameInfo,
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

    socket.on("callClientToUpdateGameCompletion", (clientProps: IClientUpdateProps) => {
        store.dispatch({
            type: DaddyGameTypes.COMPLETED_GAME,
            payload: {
                playerPositions: clientProps.playerPositions,
                pawnsInfo: clientProps.pawnsInfo,
                isDaddy: clientProps.isDaddy,
                wonBy: clientProps.newPlayerId,
                type: 'completed' as GameStatusType
            }
        })
    })
}