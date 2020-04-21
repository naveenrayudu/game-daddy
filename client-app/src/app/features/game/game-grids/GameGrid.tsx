import React from 'react';
import './gameGrid.css';
import Box from '../box/Box';


const GameGrid = () => {

   
    return (
        <div style={{
            position: 'relative',
            height: '100%'
        }}>
            {
              <Box />
            }
        </div>

    )
}

export default GameGrid
