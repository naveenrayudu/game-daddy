import React from 'react';
import './grid.css';
import { BoxActionType, DropEventType } from '../../../common/models/types';
import DropZone from '../drop-zone/DropZone';
import DragZone from '../drag-zone/DragZone';


const Grid: React.FC<{
    index: number,
    boxedIndex: number,
    actionType: BoxActionType,
    userActionHandler: (index: number, actionType: BoxActionType) => void,
    dragDropHandler: (index: number, actionType: DropEventType) => void,
    content: string
}> = ({boxedIndex, index, actionType, userActionHandler, dragDropHandler, content}) => {
    return (
        <div className={`grid_${index}`} style={{
            position:'relative'
        }}>
            <div className={`grid-content--class ${actionType === 'delete' ? 'allow_delete' : ''}`}  style={{
                border: '1px solid black',
                borderRadius: '50%',
                background: `${actionType === 'delete'? 'red': 'white'}`,
                color: `${actionType === 'delete'? 'white': 'black'}`,
                height: '20%',
                width: '20%',
                position:'absolute'
            }}>
                {
                    actionType === 'drop' ? (
                    <DropZone dragDropHandler={dragDropHandler} boxedIndex={boxedIndex} actionType={actionType} />
                   ):
                   actionType === 'grab' ? 
                    (<DragZone content={content} dragDropHandler={dragDropHandler} boxedIndex={boxedIndex} actionType={actionType} userActionHandler={userActionHandler} />)
                    : (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            background: 'transparent',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: `${actionType === 'none' ? 'not-allowed' : 'pointer'}`
                        }} onClick={() => userActionHandler(boxedIndex, actionType)}>
                            {content}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Grid
