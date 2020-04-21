import store from '../store';
import socket from './socketCreation';
import createJoinRoom from './room';
import gameListeners from './game';
import gamePositions from './gamePositions';

const SocketClient = () => {
    const {joinRoom, createRoom, leaveRoom} = createJoinRoom(socket, store);
    gameListeners(socket, store);
    const {updateUserPlays, deleteUserPawns, moveUserPlays} = gamePositions(socket, store);

  
    return {
        joinRoom,
        createRoom,
        updateUserPlays,
        deleteUserPawns,
        moveUserPlays,
        leaveRoom
    }
}

export default SocketClient();



    