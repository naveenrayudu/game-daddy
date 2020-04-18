import openSocket from 'socket.io-client';
import store from '../store';
import {DaddyGameTypes} from '../common/types'

const SocketClient = () => {
    let baseUrl = "";
    if(process.env.NODE_ENV === "development") {
        baseUrl = "http://localhost:5000"
    }
   let socket: SocketIOClient.Socket = openSocket(`${baseUrl}/daddy`.trim(), {
       upgrade: false
   });
   
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

   

    const updateUserPlays = (playerId: number, roomId: string, index: number, currentGamePositions: {
        [playerId:number] : number[]
    }) => {
        socket.emit("callServerToUpdatePositions", roomId, playerId, index, currentGamePositions || {});
    }




    socket.on("updateclientfornewplayers", (players: number[]) => {
        store.dispatch({
            type: DaddyGameTypes.ADD_PLAYERS,
            payload: players
       })
    });

    socket.on("startgame", (currentPlayerId: number) => {
        store.dispatch({
            type: DaddyGameTypes.START_GAME,
            payload: {
                currentPlayerId: currentPlayerId,
                canPlayGame: true
            }
        })
    })

    socket.on("callClientToUpdatePlayerPositions", (gamePositions: {
        [playerId:number] : number[]
    }, currentPlayerId: number) => {
        debugger;
        store.dispatch({
            type: DaddyGameTypes.UPDATE_GAME_POSITIONS,
            payload: {
                gamePositions,
                currentPlayerId
            } 
        })
    });

    return {
        joinRoom,
        createRoom,
        updateUserPlays
    }
}

export default SocketClient();



    