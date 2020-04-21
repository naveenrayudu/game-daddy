import React from 'react'

const WonModal: React.FC<{
    okClickHandler: () => void
}> = ({okClickHandler}) => {
    return (
        <div>
            <div style={{
                color: 'green',
                fontSize: '24px',
                marginBottom: '10px'
            }}>
                Congratulations.
                You won the game...
            </div>
            <div>
                <button onClick={okClickHandler}>Continue</button>
            </div>
        </div>

    )
}

export default WonModal
