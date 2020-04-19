import React from 'react';
import './grid.css';

const playerSymbols = ['X', 'O'];

const Grid: React.FC<{
    index: number,
    playerId: number,
    boxNumber: number,
    numberOfPoints: number,
    isCurrentPlayer: boolean,
    positionsToDelete: number[],
    placePawns: (index: number) => void,
    deletePlayerPawn: (index: number, playerId: number) => void,
    isDaddy: boolean,
    gamePositions: {
        [playerId: number]: number[];
    }
}> = ({ boxNumber, numberOfPoints, placePawns, index, playerId, gamePositions, isDaddy, isCurrentPlayer, positionsToDelete, deletePlayerPawn}) => {

    const boxedIndex = boxNumber * numberOfPoints + index;
    let content = '';
    for (const id in gamePositions) {
        if (gamePositions.hasOwnProperty(id)) {
            if(gamePositions[id].indexOf(boxedIndex) > -1) {
                content = playerSymbols[parseInt(id, 10) - 1];
            }
        }
    }
    const allowDeletion = isDaddy && isCurrentPlayer && positionsToDelete.indexOf(boxedIndex) !== -1;
    const allowPlacement = isCurrentPlayer && !isDaddy && !content;
    const showAllowedCursor = allowDeletion || allowPlacement;
    
    

    const clickEvent = () => {
        if(!showAllowedCursor)
            return;

        if(allowDeletion) {
            deletePlayerPawn(boxedIndex, playerId);
        } else if(allowPlacement) {
            placePawns(boxedIndex);
        }
    }

   

    return (
        <div className={`grid_${index}`} style={{
            position:'relative'
        }}>
            <div className={`grid-content--class ${allowDeletion ? 'allow_delete' : ''}`} onClick={clickEvent}  style={{
                cursor: `${showAllowedCursor ? 'pointer' as 'pointer' : 'not-allowed' as 'not-allowed'} `,
                border: '1px solid black',
                borderRadius: '50%',
                background: `${allowDeletion? 'red': 'white'}`,
                color: `${allowDeletion? 'white': 'black'}`,
                height: '20%',
                width: '20%',
                position:'absolute'
            }}>
                {content}
            </div>
        </div>
    )
}

export default Grid
