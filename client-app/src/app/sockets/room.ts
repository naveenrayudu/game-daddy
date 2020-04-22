import { Store } from "redux";
import {DaddyGameTypes} from '../common/types';
import { GameStatusType } from "../common/models/types";

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


    const leaveRoom = (roomId: string) => {
        socket.emit("leave", roomId, () => {
            store.dispatch({
                type: DaddyGameTypes.LEAVE_ROOM
            })
        })
    }

    const playerLeftGame = () => {
        store.dispatch({
            type: DaddyGameTypes.COMPLETED_GAME,
            payload: {
                playerId: 0,
                type: 'abondoned' as GameStatusType
            }
        })
    }


    socket.on("updateClientForOtherPlayerLeftRoom", () => {
        playerLeftGame();
    })
    

    socket.on("clientClosedBrowser", () => {
        playerLeftGame();
    })

    return {
        joinRoom,
        createRoom,
        leaveRoom
    }
}