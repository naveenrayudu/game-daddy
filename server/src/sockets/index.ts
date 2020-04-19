import socketIO from 'socket.io';
import {Server} from 'http';
import GirdProperties from '../helpers/gridProperties';

const SocketClient = (httpServer: Server) => {
    const io = socketIO(httpServer)
    const gameNameSpace = '/daddy';
    const daddyPlayers = 2;
    io.of(gameNameSpace).on("connection", (socket) => {
       
        socket.on("create", ( fn: any) => createGame(socket, gameNameSpace, daddyPlayers,  fn));
        socket.on("join", (room: string, fn: any) => joinGame(socket, gameNameSpace, room, daddyPlayers, fn));
        socket.on('leave', (room: string) => leaveGame(socket, room));
    
        socket.on('callServerToUpdatePositions', updateGamePositions);
        socket.on('deletePlayerPawns', deletePlayerPawns);
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
        }, pawnsInfo: {
            [playerId:number] : {
                availablePawns: number,
                unavailablePawns: number
            }
        }) => {

            if(!currentGamePositions[playerId]) {
                currentGamePositions[playerId] = [index];
            } else {
                currentGamePositions = {...currentGamePositions, [playerId]: [...currentGamePositions[playerId], index] }
            }

            if(pawnsInfo[playerId]) {
                pawnsInfo[playerId].availablePawns = pawnsInfo[playerId].availablePawns - 1;
            }

            // check if the position placed is a daddy.
            const isDaddy = checkIfPositionIsInDaddy(index, currentGamePositions[playerId]);

            let updatedPlayerId = playerId % daddyPlayers + 1;
            let positionsToDelete: number[] = [];
            if(isDaddy)
            {
                updatedPlayerId = playerId;
                positionsToDelete = getPositionsThatCanBeDeletedByPlayer(playerId, currentGamePositions);
            }
                
           
            io.of(gameNameSpace).in(roomId).emit('callClientToUpdatePlayerPositions', currentGamePositions, updatedPlayerId, pawnsInfo, isDaddy, positionsToDelete);
    }

    const deletePlayerPawns = (roomId: string, playerId: number, index: number, currentGamePositions: {
        [playerId:number] : number[]
    }, pawnsInfo: {
        [playerId:number] : {
            availablePawns: number,
            unavailablePawns: number
        }
    }) => {
        const otherPlayerId = playerId % daddyPlayers + 1;
        const updatedOtherPlayerPosition = currentGamePositions[otherPlayerId].filter(t => t !== index);
        const updatedOtherPlayersPawnsInfo = {...pawnsInfo[otherPlayerId], unavailablePawns: pawnsInfo[otherPlayerId].unavailablePawns + 1 };
        const newPositions = {...currentGamePositions, [otherPlayerId]:updatedOtherPlayerPosition};
        const updatedPawns = {...pawnsInfo, [otherPlayerId]:updatedOtherPlayersPawnsInfo};


        io.of(gameNameSpace).in(roomId).emit('callClientToUpdatePlayerPositions', newPositions, otherPlayerId, updatedPawns, false, []);
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

    const getPositionsThatCanBeDeletedByPlayer = (playerId: number, currentGamePositions: {
        [playerId:number] : number[]
    }): number[] => {
        debugger;
        const positionsToDelete: number[] = [];
        const otherPlayerId = Object.keys(currentGamePositions).find(t => t !== playerId.toString());
        if(otherPlayerId && currentGamePositions[parseInt(otherPlayerId, 10)])
        {
            const otherPlayerPositions = currentGamePositions[parseInt(otherPlayerId, 10)];
            otherPlayerPositions.forEach((t => {
                if(!checkIfPositionIsInDaddy(t, otherPlayerPositions)) {
                    positionsToDelete.push(t);
                }
            }))

            // if there are no valid positions to delete, then allow any positions to delete
            if(positionsToDelete.length === 0) {
                otherPlayerPositions.forEach(t => {
                    positionsToDelete.push(t);
                });
            }
        }

        return positionsToDelete;
    }

    const checkIfPositionIsInDaddy = (position: number, currentPlayerPositions: number[]): boolean => {
        const validDaddyPosition = GirdProperties.scorePointsByIndex[position];

        if(!currentPlayerPositions || !validDaddyPosition)
            return false;

        return validDaddyPosition.some((validPosition) => {
            return validPosition.every(t => currentPlayerPositions.indexOf(t) !== -1)
        });
    }

    return io;
}

export default SocketClient;


