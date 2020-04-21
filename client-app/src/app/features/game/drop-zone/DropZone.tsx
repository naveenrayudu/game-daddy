import React, { useRef, useEffect } from 'react'
import { DropEventType, BoxActionType } from '../../../common/models/types'

const DropZone: React.FC<{
    boxedIndex: number,
    actionType: BoxActionType,
    dragDropHandler: (index: number, actionType: DropEventType) => void
}> = ({dragDropHandler, boxedIndex, actionType}) => {

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(ref.current && actionType !== 'drop')
            ref.current.style.background = 'white';
    }, [actionType])
    
    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        if(ref.current)
            ref.current.style.background = 'transparent';

        dragDropHandler(boxedIndex, 'ondrop');
    }

    const onDragEnter = () => {
        if(!ref.current)
            return;

         ref.current.style.background = 'green';
    }

    const onDragLeave = () => {
        if(!ref.current)
            return;

        ref.current.style.background = 'yellow';
    }

    return (
        <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%'
        }} onDrop={onDrop}  onDragLeave={onDragLeave} onDragEnter={onDragEnter} ref={ref} onDragOver={(e) => e.preventDefault()} className="dropzone">

        </div>
    )
}

export default DropZone
