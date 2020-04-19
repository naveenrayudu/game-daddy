import React from 'react';
import './app.css';
import Game from './features/game/Game';
import SocketClient from './sockets';
import {  useSelector } from 'react-redux';
import { IAppState } from './common/models/redux-state';
import Modal from './features/modal/Modal';
import CreateJoinGame from './features/create-join-game/CreateJoinGame';
import GridHelper from './helpers/gridProperties';

console.log(GridHelper.validPointPositions)
const App: React.FC = () => {
    const {roomId, playersCount, canPlayGame} = useSelector(((state: IAppState) => ({
        roomId: state.daddyGame.roomId,
        playersCount: state.daddyGame.gamePlayerIds.length,
        canPlayGame: state.daddyGame.canPlayGame
    })));

    console.log(playersCount)
    const createRoom = () => {
        SocketClient.createRoom();
    }

    const joinRoom = (roomIdToJoin: string) => {
        SocketClient.joinRoom(roomIdToJoin)
    }

    const leaveRoom = () => {

    }

    return (
        <div id="app-container">
            { canPlayGame && <Game /> }
            {!canPlayGame && <CreateJoinGame playersCount={playersCount} roomId={roomId} createRoomEvent={createRoom} joinRoomEvent={joinRoom} leaveRoomEvent={leaveRoom}  /> }
            <Modal />
        </div>
    )
}

export default App
