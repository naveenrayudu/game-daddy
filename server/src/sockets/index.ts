import socketIO from 'socket.io';
import {Server} from 'http';

const SocketClient = (httpServer: Server) => {
    const io = socketIO(httpServer)
    const gameNameSpace = '/daddy';
    const daddyPlayers = 2;
    io.of(gameNameSpace).on("connection", (socket) => {
       
        socket.on("create", ( fn: any) => createGame(socket, gameNameSpace, daddyPlayers,  fn));
        socket.on("join", (room: string, fn: any) => joinGame(socket, gameNameSpace, room, daddyPlayers, fn));
        socket.on('leave', (room: string) => leaveGame(socket, room));
    
        socket.on('callServerToUpdatePositions', updateGamePositions)
    })

    const createGame = (socket: SocketIO.Socket, gameNameSpace: string, playersCount: number, fn: any) => {
        const roomNumber = createRandomRoomNumber();
        joinGame(socket, gameNameSpace, roomNumber, playersCount, fn);
    }

    const joinGame = (socket: SocketIO.Socket, gameNameSpace: string, room: string, playersCount: number, fn: any) => {
        socket.join(room, () => {
            const clientsCount = getRoomClientsCount(gameNameSpace, room);
         

            const playerIds = [];
            for(let i = 0; i < clientsCount; i++) {
                playerIds.push(i + 1);
            }

            if(fn && typeof (fn) === 'function') {
                fn(room, clientsCount, playerIds);
            }

            // Update existing clients regarding the join.
            socket.in(room).emit("updateclientfornewplayers", playerIds);

           
            // allow starting the game if all the players joined the game.
            if(clientsCount === playersCount) {
                const currentPlayerId = Math.ceil((Math.random() * 10)/ 5);
                io.of(gameNameSpace).in(room).emit("startgame", currentPlayerId);
            }
        });
    }

    const updateGamePositions = (roomId: string, playerId: number, index: number, currentGamePositions: {
            [playerId:number] : number[]
        }) => {

            if(!currentGamePositions[playerId]) {
                currentGamePositions[playerId] = [index];
            } else {
                currentGamePositions = {...currentGamePositions, [playerId]: [...currentGamePositions[playerId], index] }
            }
           
            io.of(gameNameSpace).in(roomId).emit('callClientToUpdatePlayerPositions', currentGamePositions, playerId % daddyPlayers + 1);
    }
    

    const leaveGame = (socket: SocketIO.Socket, room: string) => {
        if(Object.keys(socket.rooms).indexOf(room) === -1) {
            return;
        }

        socket.leave(room);
    }


    const createRandomRoomNumber = (): string => {
        let roomNumber: string = "";
        for(let i = 0; i < 7; i++) {
            roomNumber = roomNumber + Math.ceil(Math.random()* 9).toString()
        }
        return roomNumber;
    }

    const getRoomClientsCount = (gameNameSpace: string, room: string): number => {
      return io.of(gameNameSpace).adapter.rooms[room].length;
    }

    return io;
}

export default SocketClient;


