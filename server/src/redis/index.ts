import redis from 'redis';
import socketIORedis from 'socket.io-redis';

const redisOptions = {
    port: parseInt(process.env.REDIS_PORT, 10),
    host: process.env.REDIS_ENDPOINT,
    password: process.env.REDIS_PASSWORD
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