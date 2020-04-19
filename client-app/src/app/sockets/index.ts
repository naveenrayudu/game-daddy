import store from '../store';
import socket from './socketCreation';
import createJoinRoom from './room';
import gameListeners from './game';
import gamePositions from './gamePositions';

const SocketClient = () => {
    const {joinRoom, createRoom} = createJoinRoom(socket, store);
    gameListeners(socket, store);
    const {updateUserPlays, deleteUserPawns} = gamePositions(socket, store);

  
    return {
        joinRoom,
        createRoom,
        updateUserPlays,
        deleteUserPawns
    }
}

export default SocketClient();



    