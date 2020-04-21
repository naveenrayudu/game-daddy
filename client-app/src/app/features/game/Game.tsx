import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IAppState } from '../../common/models/redux-state';
import PawnsList from './pawns/PawnsList';
import GameGrid from './game-grids/GameGrid';
import './game.css';
import TimerBorder from '../timer-border/TimerBorder';


const Game = () => {
    const { playerId, pawnsInfo, gamePlayerIds, roomId, isCurrentPlayer } = useSelector(((state: IAppState) => ({
        playerId: state.daddyGame.playerId,
        pawnsInfo: state.daddyGame.pawnsInfo,
        gamePlayerIds: state.daddyGame.gamePlayerIds,
        roomId: state.daddyGame.roomId,
        isCurrentPlayer: state.daddyGame.isCurrentPlayer
    })))

    useEffect(() => {
        if(roomId && gamePlayerIds.length > 1)
            window.onbeforeunload = () => "Do you want to leave the game?";
        else
            window.onbeforeunload = null;
       
        return () => {
            window.onbeforeunload = null;
        }
    }, [roomId, gamePlayerIds.length])

    const otherPlayerId = gamePlayerIds.find(t => t !== playerId) || 0;
    const thisPlayerPawns = pawnsInfo[playerId];
    const otherPlayerPawns = pawnsInfo[otherPlayerId];


   
    return (
        <div className="game--class">
            <div className="game-top-bar--class">
                <div className="currentplayer-unavailable-pawns--class">
                    {

                        thisPlayerPawns && <PawnsList count={thisPlayerPawns.unavailablePawns} />
                    }
                </div>
                <div className="game-game-grid--class">
                    {
                        <GameGrid />
                    }
                </div>
                <div className="otherplayer-unavailable-pawns--class">
                    {
                        otherPlayerPawns && <PawnsList count={otherPlayerPawns.unavailablePawns} />
                    }
                </div>
            </div>

            <div className="game-bottom-bar--class">
                <div className={`currentplayer-available-pawns--class`}>
                {
                    thisPlayerPawns &&
                    // <TimerBorder showTimer={isCurrentPlayer}>
                        <PawnsList count={thisPlayerPawns.availablePawns} />
                    // </TimerBorder>
                }
                </div>
                <div className={`otherplayer-available-pawns--class`}>
                    {
                        otherPlayerPawns && 
                        // <TimerBorder showTimer={!isCurrentPlayer}>
                            <PawnsList count={otherPlayerPawns.availablePawns} />
                        // </TimerBorder> 
                    }
                </div>
            </div>
        </div>

    )
}

export default Game;
