import { Store } from "redux";
import {DaddyGameTypes} from '../common/types';

export default (socket: SocketIOClient.Socket, store: Store) => {
    const joinRoom = (room: string) => {
        socket.emit("join", room, (roomId: string, playerId: number, players: number[]) => {
           store.dispatch({
               type: DaddyGameTypes.JOIN_ROOM,
               payload: {
                   roomId: roomId,
                   playerId,
                   players
               }
           })
        })
    }

    const createRoom = () => {
        socket.emit("create", (roomId: string, playerId: number, players: number[]) => {
            store.dispatch({
                type: DaddyGameTypes.CREATE_ROOM,
                payload: {
                    roomId,
                    playerId,
                    players
                }
            })
        })
    }

    return {
        joinRoom,
        createRoom
    }
}