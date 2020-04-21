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
            debugger;
            store.dispatch({
                type: DaddyGameTypes.LEAVE_ROOM
            })
        })
    }


    socket.on("updateClientForOtherPlayerLeftRoom", () => {
        store.dispatch({
            type: DaddyGameTypes.COMPLETED_GAME,
            payload: {
                completionType: 'abondoned' as GameStatusType
            }
        })
    })
    

    socket.on("clientClosedBrowser", () => {
       
    })

    return {
        joinRoom,
        createRoom,
        leaveRoom
    }
}