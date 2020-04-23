import { IAction, IDaddyGameState, IGameInfo, IClientUpdateProps } from "../../../common/models/redux-state";
import {DaddyGameTypes} from '../../../common/types';
import { GameStatusType } from "../../../common/models/types";
import animationReducer from "../animations/animations-reducer";

const initialState: IDaddyGameState = {
    gameId: '',
    playerId: 0,
    currentPlayerId: 0,
    pawnsInfo: {},
    canPlayGame: false,
    gamePlayerIds: [],
    positionsToDelete: [],
    isCurrentPlayer: false,
    isDaddy: false,
    playerPositions: {},
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
                     gameId:action.payload.gameId, 
                     playerId:action.payload.playerId, 
                     gamePlayerIds: action.payload.players, 
                     gameStatus: {
                            playerId: 0,
                            type: 'none' as GameStatusType
                        },
                     animation: animationReducer(action, undefined, undefined)
                    };

        case DaddyGameTypes.CANCEL_ROOM:
        case DaddyGameTypes.LEAVE_ROOM:
            return initialState;

        case DaddyGameTypes.ADD_PLAYERS:
            return {...state, gamePlayerIds: action.payload}

        case DaddyGameTypes.START_GAME:
            return startGameReducer(state, action);

        case DaddyGameTypes.UPDATE_GAME_POSITIONS:
            const payload = action.payload as IClientUpdateProps;

            return {...state,
                     playerPositions: payload.playerPositions, 
                     isCurrentPlayer: state.playerId === payload.newPlayerId,
                     pawnsInfo: payload.pawnsInfo,
                     isDaddy: payload.isDaddy,
                     positionsToDelete: payload.positionsToDelete,
                     animation: animationReducer(action, payload.added, payload.deleted)
                    };

        case DaddyGameTypes.COMPLETED_GAME:
            return {
                ...state,
                playerPositions: action.payload.playerPositions || {}, 
                pawnsInfo: action.payload.pawnsInfo || {},
                isDaddy: action.payload.isDaddy || false,
                gameStatus: {
                    playerId: action.payload.wonBy,
                    type: action.payload.type as GameStatusType
                },
                canPlayGame: false,
                animation: animationReducer(action, action.payload.added, action.payload.deleted)
            }    
        default:
            return state;
    }
}


const startGameReducer = (state = initialState, action: IAction) => {
    const gameInfo = (action.payload as IGameInfo & {canPlayGame: boolean});
    return { ...state,
            ...gameInfo,
            canPlayGame: true,
            isCurrentPlayer: state.playerId === action.payload.currentPlayerId, 
            gameStatus: {
                playerId: 0,
                type: 'inprogress' as GameStatusType
            },
            animation: animationReducer(action, undefined, undefined)
        }
}

export default daddyReducer;