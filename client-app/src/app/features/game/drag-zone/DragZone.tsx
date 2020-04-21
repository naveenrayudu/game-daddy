import React, { useRef, useEffect } from 'react'
import { BoxActionType, DropEventType } from '../../../common/models/types';

const DragZone: React.FC<{
    boxedIndex: number,
    actionType: BoxActionType, 
    userActionHandler: (index: number, actionType: BoxActionType) => void,
    dragDropHandler: (index: number, actionType: DropEventType) => void,
    content: string
}> = ({boxedIndex, actionType, dragDropHandler, userActionHandler, content}) => {

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if(ref.current && actionType !== 'grab')
            ref.current.style.background = 'transparent';
    }, [actionType])
    
    const eventHandler = () => {
        userActionHandler(boxedIndex, actionType);
    }

    const onDragEndEvent = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if(ref.current)
            ref.current.style.background = 'transparent'; 
        dragDropHandler(boxedIndex, e.dataTransfer.dropEffect as DropEventType)
    }

    const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        if(ref.current)
            ref.current.style.background = 'lightgrey';
        dragDropHandler(boxedIndex, 'onstart')
    }


    return (
        <div ref={ref} style={{
            cursor: 'grab',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }} draggable={true} onDragEnd={onDragEndEvent} onClick={eventHandler} onDragStart={onDragStart} >
            {content}
        </div>
    )
}

export default DragZone
