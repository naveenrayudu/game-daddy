import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IAppState } from '../../common/models/redux-state';
import PawnsList from './pawns/PawnsList';
import GameGrid from './game-grids/GameGrid';
import './game.css';
import TimerBorder from '../timer-border/TimerBorder';
import HealthStatus from './health-status/HealthStatus';


const Game: React.FC<{
    onLeaveGame: () => void
}> = ({onLeaveGame}) => {
    const { playerId, pawnsInfo, gamePlayerIds, roomId, isCurrentPlayer } = useSelector(((state: IAppState) => ({
        playerId: state.daddyGame.playerId,
        pawnsInfo: state.daddyGame.pawnsInfo,
        gamePlayerIds: state.daddyGame.gamePlayerIds,
        roomId: state.daddyGame.gameId,
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
                <div className="thisplayer-unavailable-pawns--class">
                    {
                        <HealthStatus unavailablePawns={thisPlayerPawns.unavailablePawns} isThisPlayer={true}  />
                    }
                </div>
                <div className="game-game-grid--class">
                    {
                        <GameGrid />
                    }
                </div>
                <div className="otherplayer-unavailable-pawns--class">
                    {
                        <HealthStatus  unavailablePawns={otherPlayerPawns.unavailablePawns} isThisPlayer={false} />
                    }
                </div>
            </div>

            <div className="game-bottom-bar--class">
                <div className={`thisplayer-available-pawns--class ${isCurrentPlayer ? 'current-active--class': ''}`}>
                {
                    thisPlayerPawns && thisPlayerPawns.availablePawns > 0 ?
                  
                        <PawnsList  isCurrentPlayer={isCurrentPlayer} isThisPlayer={true} count={thisPlayerPawns.availablePawns} />
                        : <div>Your move</div>
                }
                </div>
                <div className="leave-game--class">
                    <button onClick={onLeaveGame}>Leave Game</button>
                </div>
                <div className={`otherplayer-available-pawns--class ${!isCurrentPlayer ? 'current-active--class': ''}`}>
                    {
                        otherPlayerPawns && otherPlayerPawns.availablePawns > 0 ?
                            <PawnsList isCurrentPlayer={isCurrentPlayer} isThisPlayer={false} count={otherPlayerPawns.availablePawns} />
                            :
                            <div>Opponents Move</div>
                      
                    }
                </div>
            </div>
        </div>

    )
}

export default Game;
