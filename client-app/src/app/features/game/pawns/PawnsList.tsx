import React from 'react'

const PawnsList: React.FC<{
    count: number,
    isThisPlayer: boolean,
    isAvalilablePawns: boolean
}> = ({ count, isThisPlayer, isAvalilablePawns }) => {
    return (
        <div>{count}</div>
    )
}

export default PawnsList
