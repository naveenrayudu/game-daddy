import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import redis from './redis';

import SocketClient from './sockets';


import './config/index';

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;
const io = SocketClient(httpServer, redis);

app.use(cors());
app.use(express.static(path.join(__dirname, '..',  '..', 'client-app','build')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client-app','build', 'index.html'));
})

httpServer.listen(PORT, () => {
    console.log('Listening on port', PORT);
})
