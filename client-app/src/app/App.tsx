import React, { useEffect, useCallback } from 'react';
import './app.css';
import Game from './features/game/Game';
import SocketClient from './sockets';
import {  useSelector } from 'react-redux';
import { IAppState } from './common/models/redux-state';
import Modal from './features/modal/Modal';
import CreateJoinGame from './features/create-join--leave-game/CreateJoinGame';
import store from './store';
import { ModalTypes } from './common/types';
import WonModal from './features/game/game-modals/won/WonModal';
import LostModal from './features/game/game-modals/lost/LostModal';
import { GameStatusType } from './common/models/types';
import LeaveGame from './features/create-join--leave-game/LeaveGame';
import Abondoned from './features/game/game-modals/abondoned/Abondoned';

const App: React.FC = () => {
    const {roomId, playersCount, canPlayGame, gameStatus, currentPlayerId, modal} = useSelector(((state: IAppState) => ({
        roomId: state.daddyGame.roomId,
        playersCount: state.daddyGame.gamePlayerIds.length,
        canPlayGame: state.daddyGame.canPlayGame,
        gameStatus: state.daddyGame.gameStatus,
        currentPlayerId: state.daddyGame.playerId,
        modal: state.modal
    })));

    const closeModal= useCallback(() => {
        store.dispatch({
            type: ModalTypes.REMOVE_MODAL
        })
    }, [])

    const leaveRoom = useCallback(() => {
        SocketClient.leaveRoom(roomId);
        closeModal();
    }, [roomId, closeModal]);

    useEffect(() => {
        if(gameStatus.type === 'completed' as GameStatusType)  {
            let payload = {};
            if(gameStatus.playerId === currentPlayerId) {
                payload = {
                    content: <WonModal okClickHandler={closeModal} />
                }
            } else {
                payload = {
                    content: <LostModal onClickHandler={closeModal} />
                }
            }

             store.dispatch({
                type: ModalTypes.CREATE_MODAL,
                payload: payload
            })

            return;
        }

        if(gameStatus.type === 'abondoned' as GameStatusType &&  gameStatus.playerId !== currentPlayerId)  {
            const payload =  {
                    content: <Abondoned content={'Other player left the game'} continueText={'Continue'} continueClickHandler={leaveRoom} />
                }

             store.dispatch({
                type: ModalTypes.CREATE_MODAL,
                payload: payload
            })

            return;
        }
    }, [gameStatus, currentPlayerId, leaveRoom, closeModal])

    

    const createRoom = () => {
        SocketClient.createRoom();
    }

    const joinRoom = (roomIdToJoin: string) => {
        SocketClient.joinRoom(roomIdToJoin)
    }

    const leaveRoomHandler = () => {
        if(playersCount === 1) {
            leaveRoom();
            return;
        }

        const payload =  {
            content: <Abondoned 
                            content={'Are you sure you want to leave the game? Your progress will be lost.'} 
                            continueText={'Continue'} 
                            continueClickHandler={leaveRoom}
                            showCancelButton={true}
                            cancelText={'Cancel'} 
                            cancelButtonHandler={closeModal}/>
        }
        

         store.dispatch({
            type: ModalTypes.CREATE_MODAL,
            payload: payload
        })

    }

    return (
        <div id="app-container">
            { canPlayGame && <Game /> }
            {!canPlayGame && <CreateJoinGame playersCount={playersCount} roomId={roomId} createRoomEvent={createRoom} joinRoomEvent={joinRoom} leaveRoomEvent={leaveRoom}  /> }
            {roomId && <LeaveGame leaveRoomEvent={leaveRoomHandler} />}

            <Modal content={modal.content} style={modal.styles} />
        </div>
    )
}

export default App
