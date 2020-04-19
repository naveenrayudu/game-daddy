import React from 'react';
import Grid from '../grid/Grid';
import { useSelector } from 'react-redux';
import { IAppState } from '../../../common/models/redux-state';
import SocketClient from '../../../sockets';
import './box.css';

const Box: React.FC<{
    boxNumber: number
}> = ({boxNumber}) => {

    const numberOfPoints = 8;
    const { gamePositions, playerId, isCurrentPlayer, roomId, pawnsInfo, isDaddy, positionsToDelete } = useSelector(((state: IAppState) => ({
        gamePositions: state.daddyGame.gamePositions,
        playerId: state.daddyGame.playerId,
        isCurrentPlayer: state.daddyGame.isCurrentPlayer,
        roomId: state.daddyGame.roomId,
        pawnsInfo: state.daddyGame.pawnsInfo,
        gamePlayerIds: state.daddyGame.gamePlayerIds,
        isDaddy: state.daddyGame.isDaddy,
        positionsToDelete: state.daddyGame.positionsToDelete
    })))

    const updatePlayerPositions = (index: number) => {
        if(pawnsInfo[playerId].availablePawns === 0)
            return;

        // check if game position is empty.
        for (const key in gamePositions) {
            if (Object.hasOwnProperty(key)) {
                if (gamePositions[key].indexOf(index)) {
                    return;
                }
            }
        }

        SocketClient.updateUserPlays(playerId, roomId, index, gamePositions, pawnsInfo);
    }

    const deletePlayerPawn = (index: number, playerId: number) => {
       SocketClient.deleteUserPawns(playerId, roomId, index, gamePositions, pawnsInfo);
    }


    return (
        <div className={`box--class box-${boxNumber}--class`} style={{
            width: `${100 - boxNumber * 20}%`,
            height: `${100 - boxNumber * 20}%`,
            left: `${boxNumber * 10 }%`,
            top: `${boxNumber * 10}%`
        }}>
           {
               Array.from(Array(numberOfPoints).keys()).map((index) => {
                return <Grid key={index} 
                            playerId={playerId}
                            isDaddy={isDaddy}
                            boxNumber={boxNumber} 
                            numberOfPoints={numberOfPoints} 
                            index={index} 
                            isCurrentPlayer = {isCurrentPlayer}
                            placePawns={updatePlayerPositions} 
                            deletePlayerPawn={deletePlayerPawn}
                            gamePositions={gamePositions}
                            positionsToDelete={positionsToDelete} />
               })
           }
        </div>
    )
}

export default Box
