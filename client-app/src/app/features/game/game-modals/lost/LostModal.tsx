import React from 'react'

const LostModal: React.FC<{
    onClickHandler: () => void
}> = ({ onClickHandler }) => {
    return (
        <div>
            <div style={{
                color: 'red',
                fontSize: '24px',
                marginBottom: '10px'
            }}>
                Sorry, you lost the game...
            </div>
            <button onClick={onClickHandler}>Continue</button>
        </div>
    )
}

export default LostModal
