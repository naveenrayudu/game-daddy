import { IAction, IDaddyGameState } from "../../../common/models/redux-state";
import {DaddyGameTypes} from '../../../common/types';

const initialState: IDaddyGameState = {
    roomId: '',
    playerId: 0,
    pawnsInfo: {},
    canPlayGame: false,
    gamePlayerIds: [],
    positionsToDelete: [],
    isCurrentPlayer: false,
    isDaddy: false,
    gamePositions: {}
}

const daddyReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case DaddyGameTypes.CREATE_ROOM:
        case DaddyGameTypes.JOIN_ROOM:
            return {...state, roomId:action.payload.roomId, playerId:action.payload.playerId, gamePlayerIds: action.payload.players};
        
        case DaddyGameTypes.SWITCH_CURRENT_PLAYER:
            return {...state, isCurrentPlayer: action.payload};
        
        case DaddyGameTypes.CANCEL_ROOM:
            return {...state, roomId: action.payload};

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
                     positionsToDelete: action.payload.positionsToDelete
                    };
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
            pawnsInfo: pawnsInfo
        }
}

export default daddyReducer;