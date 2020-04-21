import React, { useState } from 'react';
import Grid from '../grid/Grid';
import { useSelector } from 'react-redux';
import { IAppState } from '../../../common/models/redux-state';
import SocketClient from '../../../sockets';
import gridProperties from '../../../helpers/gridProperties';
import './box.css';
import { BoxActionType, DropEventType } from '../../../common/models/types';

const playerSymbols = ['X', 'O'];

const Box = () => {
    const numberOfPoints = 8;
    const numberOfBoxes = 3;

    const { gamePositions, playerId, isCurrentPlayer, roomId, pawnsInfo, isDaddy, positionsToDelete, contentInfo, playerGamePositions, animationInfo } = useSelector(((state: IAppState) => {
   
        const updatedContentInfo: string[] = new Array(24);  
        const playerGamePositions: {
            [id:number] : boolean[]
        } = { }

        for(let i = 0; i < updatedContentInfo.length; i++) {
            updatedContentInfo[i] = '';
        }
        

        for (const id in state.daddyGame.gamePositions) {
            if (state.daddyGame.gamePositions.hasOwnProperty(id)) {
                const hasPawns = new Array(24); 
                for(let i = 0; i < hasPawns.length; i++) {
                    hasPawns[i] = false;
                }

                const playerSymbol = playerSymbols[parseInt(id, 10) - 1];
                state.daddyGame.gamePositions[id].forEach(t => {
                    updatedContentInfo[t] = playerSymbol;
                    hasPawns[t] = true;
                });

                playerGamePositions[id] = hasPawns;
            }
        }

       

        return {
            gamePositions: state.daddyGame.gamePositions,
            playerId: state.daddyGame.playerId,
            isCurrentPlayer: state.daddyGame.isCurrentPlayer,
            roomId: state.daddyGame.roomId,
            pawnsInfo: state.daddyGame.pawnsInfo,
            isDaddy: state.daddyGame.isDaddy,
            positionsToDelete: state.daddyGame.positionsToDelete,
            contentInfo: updatedContentInfo,
            playerGamePositions: playerGamePositions,
            animationInfo: state.daddyGame.animation
        };
    }));

    const [dragIndex, setDragIndex] = useState<number>(-1);

    const userActionHandler = (index: number, actionType: BoxActionType) => {
        switch (actionType) {
            case 'insert':
                placePlayerPositions(index);
                break;
            case 'delete':
                deletePlayerPawn(index);
                break;
            default:
                break;
        }
    }

    const dragDropHandler = (index: number, actionType: DropEventType) => {
        switch (actionType) {
            case 'none':
                setDragIndex(-1);
                break;
            case 'onstart': 
                setDragIndex(index);
                break;
            case 'ondrop':
                upldatePlayerPositions(dragIndex, index);
                setDragIndex(-1);
                break;
            default:
                break;
        }
    }

    const placePlayerPositions = (index: number) => {
        if(pawnsInfo[playerId].availablePawns === 0)
            return;

        // check if game position is empty.
        if(contentInfo[index])
            return;
       
        SocketClient.updateUserPlays(playerId, roomId, index, gamePositions, pawnsInfo);
    }

    const deletePlayerPawn = (index: number) => {
       SocketClient.deleteUserPawns(playerId, roomId, index, gamePositions, pawnsInfo);
    }

    const upldatePlayerPositions = (oldIndex: number, newIndex: number) => {
        SocketClient.moveUserPlays(playerId, roomId, oldIndex, newIndex, gamePositions, pawnsInfo);
    }

    const getActionType = (boxedIndex: number, content: string): BoxActionType => {

        if(!isCurrentPlayer)
            return 'none';

        if(isDaddy && positionsToDelete.indexOf(boxedIndex) !== -1)
            return 'delete';
        
        if(!isDaddy && !content && pawnsInfo[playerId] && pawnsInfo[playerId].availablePawns > 0) {
            return 'insert'
        }

        if(!isDaddy && content && pawnsInfo[playerId] && pawnsInfo[playerId].availablePawns === 0 && playerGamePositions[playerId][boxedIndex])
            return 'grab';

        if(!isDaddy && dragIndex !== -1 && !content && gridProperties.validMoves[dragIndex].some(pos => pos === boxedIndex)) {
            return 'drop';
        }

        return 'none';
    }

    return (
        <React.Fragment>
            {
                Array.from(Array(numberOfBoxes).keys()).map((value, boxNumber) => {
                    return (
                        <div key={boxNumber} className={`box--class box-${boxNumber}--class`} style={{
                            width: `${100 - boxNumber * 20}%`,
                            height: `${100 - boxNumber * 20}%`,
                            left: `${boxNumber * 10 }%`,
                            top: `${boxNumber * 10}%`
                        }}>
                            {
                                Array.from(Array(numberOfPoints).keys()).map((index) => {
                
                                    const boxedIndex = boxNumber * numberOfPoints + index;
                                    const content = contentInfo[boxedIndex] ? contentInfo[boxedIndex] : '';
                                    const actionType = getActionType(boxedIndex, content!);


                                    return <Grid key={index} 
                                                actionType={actionType}
                                                boxedIndex={boxedIndex} 
                                                index={index} 
                                                userActionHandler={userActionHandler} 
                                                dragDropHandler= {dragDropHandler}
                                                content={content!}
                                                animationClass={animationInfo[boxedIndex]}  />
                                })
                            }
                        </div>
                    )
                })

            
            }
        </React.Fragment>
      
    )
}

export default Box
