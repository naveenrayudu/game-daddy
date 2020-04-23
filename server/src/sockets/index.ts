import socketIO from 'socket.io';
import {Server} from 'http';
import redis from 'redis';
import socketIORedis from 'socket.io-redis';
import socketIORoomHandler from './room';
import gameUpdates from './gameUpdates';

const SocketClient = (httpServer: Server, redis: { 
    redisClient: redis.RedisClient,
    redisAdapter: socketIORedis.RedisAdapter
}) => {

    let io = socketIO(httpServer);
    io = io.adapter(redis.redisAdapter);


    const gameNameSpace = '/daddy';
    const {createRedisRoom, joinRedisRoom, leaveRedisRoom, disconnectRedisRoom} = socketIORoomHandler(io, redis.redisClient);
    const {insertGamePawns, moveGamePawns, deletePlayerPawns} = gameUpdates(io, redis.redisClient);

   

    io.of(gameNameSpace).on("connection", (socket) => {
       
        socket.on("create", ( fn: any) => createRedisRoom(socket, fn));
        socket.on("join", (room: string, fn: any) => joinRedisRoom(socket, room, fn));
        socket.on('leave', (room: string, fn: any) => leaveRedisRoom(socket, room, fn));
       
    
        socket.on('callServerToUpdateInsertPositions', insertGamePawns);
        socket.on('callServerToMovePositions', moveGamePawns);
        socket.on('deletePlayerPawns', deletePlayerPawns);

        socket.on("disconnect", () => disconnectRedisRoom(socket));
    })


    return io;
}

export default SocketClient;


