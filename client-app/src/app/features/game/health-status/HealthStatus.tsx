import React from 'react'

// 'hsl(105, 100%, 40%)' - Green < 2
// 'hsl(40, 100%, 50%)' - Yellow < 4
// 'hsl(12, 100%, 50%)' - Red > 5

// 7, 6, 5, 4, 3, 2, 1
// const greenStaturationStart = 70;
const colorGenerator = (unavailablePawns: number, index: number) => {
    if (unavailablePawns <= 2)
        return `hsl(105, 100%, ${40 + index * 5}%)`;

    if (unavailablePawns <= 4)
        return `hsl(40, 100%, ${50 + index * 5}%)`;

    return `hsl(0, 100%, ${66 + index * 5}%)`;
}

const HealthStatus: React.FC<{
    unavailablePawns: number,
    isThisPlayer: boolean
}> = ({ unavailablePawns, isThisPlayer }) => {
    return (
        <div style={{
            position: 'relative'
        }}>
            {isThisPlayer ? <div style={{
                position: "absolute",
                transform: 'rotate(270deg)',
                left: '-15%',
                bottom: '40%' 
            }}>Your Health</div> : <div style={{
                position: "absolute",
                transform: 'rotate(90deg)',
                right: '-90%',
                bottom: '40%' 
            }}>Opponents Health</div>}
            <ul style={{
                listStyle: 'none'
            }}>
                {Array.from({ length: 7 }).map((val, index) => <li key={index} style={{
                    height: '10px',
                    width: '40px',
                    marginTop: '3px',
                    marginBottom: '3px',
                    background: index - unavailablePawns >= 0 ? colorGenerator(unavailablePawns, index) : 'white'
                }}></li>)}
            </ul>
        </div>
    )
}

export default HealthStatus
