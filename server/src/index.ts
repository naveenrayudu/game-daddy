import express from 'express';
import cors from 'cors';
import http from 'http';
import SocketClient from './sockets';

import './config/index';

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;
const io = SocketClient(httpServer);

app.use(cors());

app.get("/", (req, res) => {
    res.send('11111');
})

httpServer.listen(PORT, () => {
    console.log('Listening on port', PORT);
})
