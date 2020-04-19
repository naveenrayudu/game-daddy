import openSocket from 'socket.io-client';

const createSocketConnection = (() => {
    let socket: SocketIOClient.Socket;
    let baseUrl = "";
    if(process.env.NODE_ENV === "development") {
        baseUrl = "http://localhost:5000"
    }

    return () => {
        if(socket)
            return socket;

        socket = openSocket(`${baseUrl}/daddy`.trim(), {
            upgrade: false
        });
        return socket;
    }
})();

export default createSocketConnection();