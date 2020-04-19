import React from 'react';
import { useSelector } from 'react-redux';
import { IAppState } from '../../common/models/redux-state';
import PawnsList from './pawns/PawnsList';
import GameGrid from './game-grids/GameGrid';
import './game.css';


const Game = () => {
    const { playerId, pawnsInfo, gamePlayerIds } = useSelector(((state: IAppState) => ({
        playerId: state.daddyGame.playerId,
        pawnsInfo: state.daddyGame.pawnsInfo,
        gamePlayerIds: state.daddyGame.gamePlayerIds
    })))

    const otherPlayerId = gamePlayerIds.find(t => t !== playerId) || 0;
    const currentPlayerPawns = pawnsInfo[playerId];
    const otherPlayerPawns = pawnsInfo[otherPlayerId];


   
    return (
        <div className="game--class">
            <div className="game-top-bar--class">
                <div className="currentplayer-unavailable-pawns--class">
                    {

                        currentPlayerPawns && <PawnsList count={currentPlayerPawns.unavailablePawns} />
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
                <div className="currentplayer-available-pawns--class">
                    {
                        currentPlayerPawns && <PawnsList count={currentPlayerPawns.availablePawns} />
                    }
                </div>
                <div className="otherplayer-available-pawns--class">
                    {
                        otherPlayerPawns && <PawnsList count={otherPlayerPawns.availablePawns} />
                    }
                </div>
            </div>
        </div>

    )
}

export default Game;
