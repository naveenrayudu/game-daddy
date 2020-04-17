import React from 'react'

const Grid: React.FC<{
    index: number,
    clickHandler: (index: number) => void,
    disabled: boolean,
    content?: string
}> = ({clickHandler, disabled, content, index}) => {

    const clickEvent = () => {
        if(disabled)
            return;
        
        clickHandler(index);
    }

    return (
        <div onClick={clickEvent} style={{
            cursor: 'pointer' as 'pointer',
            height: '50%',
            width: '50%',
            borderRadius: '50%',
            background: 'white',
            position: 'absolute' as 'absolute',
            left: '-25%',
            top: '-25%',
            border: '1px solid black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
           {content}
           
        </div>
    )
}

export default Grid
