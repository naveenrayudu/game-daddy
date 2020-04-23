import store from '../store';
import socket from './socketCreation';
import createJoinRoom from './room';
import gameListeners from './game';
import gamePositions from './gamePositions';

const SocketClient = () => {
    const {joinRoom, createRoom, leaveRoom} = createJoinRoom(socket, store);
    gameListeners(socket, store);
    const {submitUserInsertPlays, deleteUserPawns, moveUserPlays} = gamePositions(socket, store);

  
    return {
        joinRoom,
        createRoom,
        submitUserInsertPlays,
        deleteUserPawns,
        moveUserPlays,
        leaveRoom
    }
}

export default SocketClient();



    