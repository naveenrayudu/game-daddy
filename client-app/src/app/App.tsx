import React from 'react';
import './app.css';
import GameGrid from './features/game-grid/GameGrid';
import SocketClient from './sockets';
import {  useSelector } from 'react-redux';
import { IAppState } from './common/models/redux-state';
import Modal from './features/modal/Modal';
import CreateJoinGame from './features/create-join-game/CreateJoinGame';


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
            {canPlayGame && <GameGrid /> }
            {!canPlayGame && <CreateJoinGame playersCount={playersCount} roomId={roomId} createRoomEvent={createRoom} joinRoomEvent={joinRoom} leaveRoomEvent={leaveRoom}  /> }
            <Modal />
        </div>
    )
}

export default App
