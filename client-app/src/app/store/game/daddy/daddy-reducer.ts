import { IAction, IDaddyGameState } from "../../../common/models/redux-state";
import {DaddyGameTypes} from '../../../common/types';

const initialState: IDaddyGameState = {
    roomId: '',
    playerId: 0,
    canPlayGame: false,
    gamePlayerIds: [],
    isCurrentPlayer: false,
    gamePositions: {}
}

const daddyReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case DaddyGameTypes.CREATE_ROOM:
        case DaddyGameTypes.JOIN_ROOM:
            return {... state, roomId: action.payload.roomId, playerId: action.payload.playerId, gamePlayerIds: action.payload.players};
        
        case DaddyGameTypes.SWITCH_CURRENT_PLAYER:
            return {... state, isCurrentPlayer: action.payload};
        
        case DaddyGameTypes.CANCEL_ROOM:
            return {...state, roomId: action.payload};

        case DaddyGameTypes.ADD_PLAYERS:
            return {...state, gamePlayerIds: action.payload}

        case DaddyGameTypes.START_GAME:
            const playerPositionsToSet: {
                [playerId:number] : number[]
            } = {};

            for (const key in state.gamePlayerIds) {
                if (Object.hasOwnProperty(key)) {
                    playerPositionsToSet[key] = [];
                }
            }
            return {...state, canPlayGame: action.payload.canPlayGame, isCurrentPlayer: state.playerId === action.payload.currentPlayerId, gamePositions:playerPositionsToSet}

        case DaddyGameTypes.UPDATE_GAME_POSITIONS:
            return {...state, gamePositions: action.payload.gamePositions, isCurrentPlayer: state.playerId === action.payload.currentPlayerId };
        default:
            return state;
    }
}

export default daddyReducer;