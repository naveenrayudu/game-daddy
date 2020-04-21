import { IAction, IDaddyGameState } from "../../../common/models/redux-state";
import {DaddyGameTypes} from '../../../common/types';
import { GameStatusType } from "../../../common/models/types";
import animationReducer from "../animations/animations-reducer";

const initialState: IDaddyGameState = {
    roomId: '',
    playerId: 0,
    pawnsInfo: {},
    canPlayGame: false,
    gamePlayerIds: [],
    positionsToDelete: [],
    isCurrentPlayer: false,
    isDaddy: false,
    gamePositions: {},
    gameStatus: {
        type: 'none',
        playerId: 0
    },
    animation: {}
}

const daddyReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case DaddyGameTypes.CREATE_ROOM:
        case DaddyGameTypes.JOIN_ROOM:
            return {...state,
                     roomId:action.payload.roomId, 
                     playerId:action.payload.playerId, 
                     gamePlayerIds: action.payload.players, 
                     gameStatus: {
                            playerId: 0,
                            type: 'none' as GameStatusType
                        },
                     animation: animationReducer(state, action)
                    };

        case DaddyGameTypes.SWITCH_CURRENT_PLAYER:
            return {...state, isCurrentPlayer: action.payload};
        
        case DaddyGameTypes.CANCEL_ROOM:
        case DaddyGameTypes.LEAVE_ROOM:
            return initialState;

        case DaddyGameTypes.ADD_PLAYERS:
            return {...state, gamePlayerIds: action.payload}

        case DaddyGameTypes.START_GAME:
            return startGameReducer(state, action);

        case DaddyGameTypes.UPDATE_GAME_POSITIONS:
            return {...state,
                     gamePositions: action.payload.gamePositions, 
                     isCurrentPlayer: state.playerId === action.payload.currentPlayerId,
                     pawnsInfo: action.payload.pawnsInfo,
                     isDaddy: action.payload.isDaddy,
                     positionsToDelete: action.payload.positionsToDelete,
                     animation: animationReducer(state, action)
                    };

        case DaddyGameTypes.COMPLETED_GAME:
            return {
                ...state,
                gamePositions: action.payload.gamePositions || {}, 
                pawnsInfo: action.payload.pawnsInfo || {},
                isDaddy: action.payload.isDaddy || false,
                gameStatus: {
                    playerId: action.payload.wonBy,
                    type: action.payload.type as GameStatusType
                },
                animation: animationReducer(state, action)
            }    
        default:
            return state;
    }
}


const startGameReducer = (state = initialState, action: IAction) => {
    const pawnsInfo: {
        [playerId:number] : {
            availablePawns: number,
            unavailablePawns: number
        }
    } = {};
    const playerPositionsToSet: {
        [playerId:number] : number[]
    } = {};



    state.gamePlayerIds.forEach((playerId) => {
        playerPositionsToSet[playerId] = [];
        pawnsInfo[playerId] = {
            availablePawns: 9,
            unavailablePawns: 0
        }
    })
   
    return { ...state, 
            canPlayGame: action.payload.canPlayGame, 
            isCurrentPlayer: state.playerId === action.payload.currentPlayerId, 
            gamePositions:playerPositionsToSet,
            pawnsInfo: pawnsInfo,
            gameStatus: {
                playerId: 0,
                type: 'inprogress' as GameStatusType
            },
            animation: animationReducer(state, action)
        }
}

export default daddyReducer;