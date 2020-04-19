import React from 'react'

const PawnsList: React.FC<{
    count: number
}> = ({count}) => {
    return (
        <div>
            {count}
        </div>
    )
}

export default PawnsList
