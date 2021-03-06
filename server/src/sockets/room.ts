import socketIORedis from 'socket.io-redis';
import redis from 'redis';
import gameHelper from '../helpers/gameHelper';
import { createOrUpdateRoom, saveGameInfoToRoom } from '../database/createRoom';
import { IGameInfo } from '../models/gameModels';

const socketIORoomHandler = (io: SocketIO.Server, redisClient: redis.RedisClient) => {
    const gameNameSpace = '/daddy';
    const daddyPlayers = 2;

   const redisAdapter = io.of(gameNameSpace).adapter as socketIORedis.RedisAdapter

    const joinRedisRoom = (socket: SocketIO.Socket, room: string, callback?: any) => {
        redisAdapter.remoteJoin(socket.id, room, (err) => {
            if(err){
                console.log(err);
                return;
            }

            // Save the socket client room.
            addRoomToSocket(socket.id, room);
           
            const clientsCount = getRoomClientsCount(room);
            const playerIds = [];
            for(let i = 0; i < clientsCount; i++) {
                playerIds.push(i + 1);
            }

            if(callback && typeof (callback) === 'function') {
                callback(room, clientsCount, playerIds);
            }

            // Update existing clients regarding the join.
            socket.in(room).emit("updateclientfornewplayers", playerIds);
            
            // allow starting the game if all the players joined the game.
            if(clientsCount === daddyPlayers) {
                const currentPlayerId = Math.ceil((Math.random() * 10)/ 5);
                const gameInfo = gameHelper.createEmptyGameModel(room, playerIds, currentPlayerId);

                redisClient.set(room, JSON.stringify(gameInfo), () => {
                    io.of(gameNameSpace).in(room).emit("startGame", {...gameInfo, canPlayGame: true});
                });
            }

            createOrUpdateRoom(room, socket.id);
            
        })
    }

    const createRedisRoom = (socket: SocketIO.Socket, callback?: any) => {
        const roomNumber = createRandomRoomNumber();
        joinRedisRoom(socket, roomNumber, callback);
    }


    const leaveRedisRoom = (socket: SocketIO.Socket, room: string, callback?: any) => {
        redisAdapter.remoteLeave(socket.id, room, () => {
            if(callback && typeof callback === 'function') {
                callback();
            }

            removeRoomFromSocket(socket.id, room, () => {

                // Inform other clients that the user left the room.
                if(getRoomClientsCount(room) > 0) {
                    // emit only when the game is incomplete..
                    redisClient.get(room, (err, gameInfoString) => {
                        if(gameInfoString) {
                            const gameInfo = JSON.parse(gameInfoString) as IGameInfo;
                            if(gameInfo && !gameInfo.isCompleted) {
                                emitSocketActions(room, 'updateClientForOtherPlayerLeftRoom');
                            }
                        }  
                    })
                }

            });
        });
    }


    const disconnectRedisRoom = (socket: SocketIO.Socket) => {
        const remoteDisconnectCallback = (rooms: string[]) => {
            //Inform users regarding the users leaving the room
            rooms.forEach(room => {
                emitSocketActions(room, 'clientClosedBrowser');
            })
        }

        redisClient.get(socket.id, (err, roomsString) => {
            if(err)
                return;

            const rooms = JSON.parse(roomsString) as string[] || [];
            remoteDisconnectCallback(rooms);

            redisClient.del(socket.id, () => {
                rooms.forEach(room => deleteRoomsNotAssociatedWithAnySocket(room));
            });
        })
    }

    const addRoomToSocket = (socketId: string, room: string) => {
        redisClient.get(socketId, (err, res) => {
            if(err)
            {
                redisClient.set(socketId, JSON.stringify([room]));
                return;
            }

            const currentRooms = JSON.parse(res) as string[] || [];
            currentRooms.push(room);

            redisClient.set(socketId, JSON.stringify(currentRooms), (err) => {
                if(err)
                    console.log(err);
            });
        });
    }


    const removeRoomFromSocket = (socketId: string, room: string, callback?: () => void) => {
        redisClient.get(socketId, (err, res) => {
            if(err)
            {
                return;
            }

            const currentRooms = (JSON.parse(res) as string[] || []).filter(t => t !== room);
            if(currentRooms.length === 0) {
                redisClient.del(socketId, (err, reply) => {
                    if(!err) {
                        deleteRoomsNotAssociatedWithAnySocket(room, callback);
                    } 
                });
            }
            else {
                redisClient.set(socketId, JSON.stringify(currentRooms), (err, reply) => {
                    if(!err) {
                        deleteRoomsNotAssociatedWithAnySocket(room, callback);
                    }  
                });
            }
        });
    }

    


    const deleteRoomsNotAssociatedWithAnySocket = (room: string, callback?: () => void) => {
        if(getRoomClientsCount(room) === 0) {
            redisClient.get(room, (err, gameString) => {
                const gameInfo = JSON.parse(gameString);

                saveGameInfoToRoom(room, gameInfo)
                    .then(() => redisClient.del(room))
                    .then(() => {
                        if(callback && typeof callback === 'function')
                            callback();
                    })
                    .catch(() => redisClient.del(room));
            })
        }
    }


    const emitSocketActions = (room: string, emitName: string) => {
        io.of(gameNameSpace).in(room).emit(emitName);
    }


    const createRandomRoomNumber = (): string => {
        let roomNumber: string = "";
        for(let i = 0; i < 7; i++) {
            roomNumber = roomNumber + Math.ceil(Math.random()* 9).toString()
        }
        return roomNumber;
    }

    const getRoomClientsCount = (room: string): number => {
        return redisAdapter.rooms[room] ? redisAdapter.rooms[room].length : 0;
    }

   return {
        createRedisRoom,
        joinRedisRoom,
        leaveRedisRoom,
        disconnectRedisRoom
   }
}

export default socketIORoomHandler;