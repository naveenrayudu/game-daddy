import React, { useState } from 'react'

const CreateJoinGame: React.FC<{
    roomId: string,
    playersCount: number,
    createRoomEvent: () => any,
    joinRoomEvent: (joinRoomId: string) => any,
    leaveRoomEvent: () => any

}> = ({roomId, playersCount, createRoomEvent, joinRoomEvent, leaveRoomEvent}) => {

    const [joinRoomId, setJoinRoomId] = useState('');

    const joinRoom = () => {
        joinRoomEvent(joinRoomId);
    }

    return (
        <div>
            {roomId && <div>RoomId: {roomId}</div>}
            <button disabled={!!roomId} onClick={createRoomEvent}>Create Room</button>
            <div>
                <input type='text' value={joinRoomId} onChange={((e) => setJoinRoomId(e.target.value))} />
                <button disabled={!!roomId || !joinRoomId} onClick={joinRoom}>
                    Join Room
                </button>
            </div>
        </div>
    )
}

export default CreateJoinGame
