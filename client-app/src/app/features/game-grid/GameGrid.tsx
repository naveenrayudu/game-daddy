import React from 'react'
import generateGamePositions from '../../helpers/gridProperties';
import './gameGrid.css';
import Grid from './grid/Grid';
import { useSelector } from 'react-redux';
import { IAppState } from '../../common/models/redux-state';
import SocketClient from '../../sockets';

const numberOfRings = 3;
const {validGamePositions, postionsToUse} = generateGamePositions(numberOfRings, numberOfRings);
const playerSymbols = ['X', 'O'];

const showLeftBorder = (index: number, upperBound: number, columns: number, rows: number): boolean => {
    if(rows === upperBound - 1)
        return false;

    if((columns === 0 || columns === upperBound - 1) )
        return true;
    
    if(columns === numberOfRings && (rows < numberOfRings - 1 || (rows >= numberOfRings + 1)))
        return true;

    let skipNumber = columns;
    if(columns > numberOfRings) {
        skipNumber = upperBound - 1 - columns;
    }
  
    if((rows - skipNumber >= 0 && rows + skipNumber < upperBound - 1) &&(index - columns) % upperBound === 0)
        return true;

    return false;
}


const showTopBorderTop = (index: number, upperBound: number, columns: number, rows: number): boolean => {

   if(columns === upperBound - 1)
    return false;

   if((rows === 0 || rows === upperBound - 1) && columns !== upperBound - 1)
        return true;

    if(rows === numberOfRings && (columns < numberOfRings - 1 || (columns >= numberOfRings + 1)))
        return true;
    
    let skipNumber = rows;
    if(rows > numberOfRings) {
        skipNumber = upperBound - rows - 1;
    }

    const lowerLimit = rows * upperBound + skipNumber;
    const upperLimit = rows * upperBound + upperBound - skipNumber - 1;
    
    return index >= lowerLimit && index < upperLimit;
}

const GameGrid = () => {

   const {gamePositions, playerId, isCurrentPlayer, roomId} = useSelector(((state: IAppState) => ({
        gamePositions: state.daddyGame.gamePositions,
        playerId: state.daddyGame.playerId,
        isCurrentPlayer: state.daddyGame.isCurrentPlayer,
        roomId: state.daddyGame.roomId
    })))

    const updatePlayerPositions = (index: number) => {

        // verify the position is a valid one.
        if(postionsToUse.indexOf(index) === -1)
            return;
       
        // check if game position is empty.
        for (const key in gamePositions) {
            if (Object.hasOwnProperty(key)) {
                if(gamePositions[key].indexOf(index)) {
                   return;
                }
            }
        }

        SocketClient.updateUserPlays(playerId, roomId, index, gamePositions);
    }


    const generateGrid = () => {
        const upperBound =  numberOfRings * 2 + 1;
        const grid = [];

        for(let rows = 0; rows < upperBound; rows++) {
            const gridRows = [];
            for(let columns = 0; columns < upperBound; columns++) {
                const index = rows * upperBound + columns;
                const isExists = postionsToUse.indexOf(index) > -1;

                let content = '';
                for (const playerId in gamePositions) {
                    if (gamePositions.hasOwnProperty(playerId)) {
                        if(gamePositions[playerId].indexOf(index) > -1) {
                            content = playerSymbols[parseInt(playerId, 10) - 1];
                        }
                    }
                }

                gridRows.push(
                    <div key={index} style={{
                        borderTop: showTopBorderTop(index, upperBound, columns, rows) ? '1px solid black': '',
                        borderLeft: showLeftBorder(index, upperBound, columns, rows) ? '1px solid black' : '',
                        position: 'relative'
                    }}>
                        {
                           isExists ? <Grid index={index} disabled={!isCurrentPlayer || !!content} clickHandler={updatePlayerPositions} content={content} /> : null
                        }
                    </div>
                );
            }
            
            
            grid.push((
                <div className="grid-columns" key={`div_${rows}`} style={{
                    gridTemplateColumns: `repeat(${upperBound}, 1fr)`
                }}>
                    {
                        gridRows
                    }
                </div>
            ))
        }
        return grid;
    }


    return (
        <div id="grid-content">
        {
           generateGrid()
        }
        </div>
       
    )
}

export default GameGrid
