import React from 'react'

const LeaveGame: React.FC<{
    leaveRoomEvent: () => void
}> = ({leaveRoomEvent}) => {
    return (
        <div>
             <button onClick={leaveRoomEvent}>Leave Room</button>
        </div>
    )
}

export default LeaveGame
