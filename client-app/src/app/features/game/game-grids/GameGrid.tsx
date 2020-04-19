import React from 'react';
import './gameGrid.css';
import Box from '../box/Box';


const GameGrid = () => {

    const numberOfBoxes = 3;
    return (
        <div style={{
            position: 'relative',
            height: '100%'
        }}>
            {
                Array.from(Array(numberOfBoxes).keys()).map((value, index) => {
                    return <Box key={index} boxNumber={index} />
                })
            }
        </div>

    )
}

export default GameGrid
