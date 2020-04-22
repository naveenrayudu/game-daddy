import redis from 'redis';
import socketIORedis from 'socket.io-redis';

const redisOptions = {
    port: 13144,
    host: 'redis-13144.c93.us-east-1-3.ec2.cloud.redislabs.com',
    password: '8ANzxHx4IUrWgf86y7rS86pZxumPYjuF'
};


const redisClient = redis.createClient(redisOptions);
const pubClient = redis.createClient(redisOptions);
const subClient = redis.createClient(redisOptions);

const redisAdapter = socketIORedis({
    pubClient: pubClient,
    subClient: subClient
})

export default{
    redisClient,
    redisAdapter
} ;