import React from 'react';
import monster from '../../../images/monster.png';
import robot from '../../../images/robot.png'




const PawnsList: React.FC<{
    count: number,
    isThisPlayer: boolean,
    isCurrentPlayer: boolean
}> = ({ count, isThisPlayer, isCurrentPlayer }) => {

    const imageSrc = isThisPlayer ? robot : monster;
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            width: '100%'
        }}>
            {
                Array.from({ length: count }, (v: any, i: number) => {
                    return <img draggable={isCurrentPlayer && isThisPlayer} style={{
                        height: '6vh',
                        margin: 'auto',
                        cursor: 'pointer'
                    }} key={i} src={imageSrc} alt='your play' />
                })
            }
        </div>

    )
}

export default PawnsList
