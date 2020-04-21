import React from 'react'

const Modal: React.FC<{
    content?: any,
    style?: {}
}> = ({content, style={}}) => {
    if(!content) {
        return null;
    }

    const updatedStyles = {...{
        zIndex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute' as 'absolute',
        top: 0,
        left: 0,
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }, ...style}

    return (
        <div style={updatedStyles}>
            {content}
        </div>
    )
}

export default Modal
