import React, { useState } from 'react';
import Grid from '../grid/Grid';
import { useSelector } from 'react-redux';
import { IAppState } from '../../../common/models/redux-state';
import SocketClient from '../../../sockets';
import gridProperties from '../../../helpers/gridProperties';
import './box.css';
import { BoxActionType, DropEventType } from '../../../common/models/types';
import robot from '../../../images/robot.png';
import monster from '../../../images/monster.png';



const Box = () => {
    const numberOfPoints = 8;
    const numberOfBoxes = 3;

    const { gamePositions, playerId, isCurrentPlayer, gameId, pawnsInfo, isDaddy, positionsToDelete, contentInfo, playerGamePositions, animationInfo } = useSelector(((state: IAppState) => {
   
        const updatedContentInfo: string[] = new Array(24);  
        const playerGamePositions: {
            [id:number] : boolean[]
        } = { }

        for(let i = 0; i < updatedContentInfo.length; i++) {
            updatedContentInfo[i] = '';
        }
        
        for (const id in state.daddyGame.playerPositions) {
            if (state.daddyGame.playerPositions.hasOwnProperty(id)) {
                const hasPawns = new Array(24); 
                for(let i = 0; i < hasPawns.length; i++) {
                    hasPawns[i] = false;
                }

                const currentPlayerId = parseInt(id, 10);
                state.daddyGame.playerPositions[id].forEach(t => {
                    updatedContentInfo[t] = currentPlayerId === state.daddyGame.playerId ? robot: monster;
                    hasPawns[t] = true;
                });

                playerGamePositions[id] = hasPawns;
            }
        }

       

        return {
            gamePositions: state.daddyGame.playerPositions,
            playerId: state.daddyGame.playerId,
            isCurrentPlayer: state.daddyGame.isCurrentPlayer,
            gameId: state.daddyGame.gameId,
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
                dragIndex === -1 ? placePlayerPositions(index) : upldatePlayerPositions(dragIndex, index);
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
       
        SocketClient.submitUserInsertPlays(playerId, gameId, index, gamePositions, pawnsInfo);
    }

    const deletePlayerPawn = (index: number) => {
       SocketClient.deleteUserPawns(playerId, gameId, index, gamePositions, pawnsInfo);
    }

    const upldatePlayerPositions = (oldIndex: number, newIndex: number) => {
        SocketClient.moveUserPlays(playerId, gameId, oldIndex, newIndex, gamePositions, pawnsInfo);
    }

    const getActionType = (boxedIndex: number, content: string): BoxActionType => {

        if(!isCurrentPlayer)
            return 'none';

        if(isDaddy && positionsToDelete.indexOf(boxedIndex) !== -1)
            return 'delete';
        
        if(!isDaddy && !content && pawnsInfo[playerId] && pawnsInfo[playerId].availablePawns > 0) {
            return 'drop';
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
                                    const isThisPlayerGrid = playerGamePositions[playerId][boxedIndex];


                                    return <Grid key={index} 
                                                actionType={actionType}
                                                boxedIndex={boxedIndex} 
                                                index={index} 
                                                userActionHandler={userActionHandler} 
                                                dragDropHandler= {dragDropHandler}
                                                content={content!}
                                                altContent={isThisPlayerGrid ? 'Your pawn': 'Opponent Pawn'}
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
