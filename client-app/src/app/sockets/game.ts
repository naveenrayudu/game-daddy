import { DaddyGameTypes } from "../common/types";
import { Store } from "redux";

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
}