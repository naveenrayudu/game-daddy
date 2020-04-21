import { IAnimationState, IAction, IDaddyGameState } from "../../../common/models/redux-state";
import { DaddyGameTypes } from "../../../common/types";
const initialState: IAnimationState = {};

const animationReducer= (state: IDaddyGameState, action: IAction) => {
    switch (action.type) {
        case DaddyGameTypes.UPDATE_GAME_POSITIONS:
            
            const isAMove = Object.keys(state.pawnsInfo).map(t => parseInt(t, 10)).every(t => (state.pawnsInfo[t].availablePawns === action.payload.pawnsInfo[t].availablePawns)
                                                            && (state.pawnsInfo[t].unavailablePawns === action.payload.pawnsInfo[t].unavailablePawns))
            let removed: number | undefined;
            let added: number | undefined;
        
            state.gamePlayerIds.forEach((key) => {
                if(!removed && state.gamePositions[key])
                    removed = state.gamePositions[key].find(position => (action.payload.gamePositions[key] as number[] || []).indexOf(position) === -1);

                if(!added && state.gamePositions[key])
                    added = (action.payload.gamePositions[key] as number[]).find(position => (state.gamePositions[key] || []).indexOf(position) === -1);
            });

        if(added !== undefined && isAMove && removed !== undefined) {
            const addRemoveAnimations = animationType(removed, added);
            return {
                    [added]: addRemoveAnimations[0],
                    // [removed]: addRemoveAnimations[1]
            } 
        }

        if(added !== undefined)
                return {
                    [added] : 'insertAdded'
                }

        if(removed !== undefined)
            return {
                [removed]: 'daddyRemoved'
            }

            return initialState;
        default:
            return initialState;
    }
}


const animationType = (from: number, to: number) => {
    if(from + 1 === to || ((from + 8 === to && [3, 11].some(t => t === from))|| (from - 8 === to && [12, 20].some(t => t === from))))
        return ["fromLeftAdded", "toRightRemoved"];
    
    if(from - 1 === to || ((from + 8 === to && [4, 12].some(t => t === from)) || (from - 8 === to && [11, 19].some(t => t === from))))
        return ["fromRightAdded", "toLeftRemoved"];

    if(from + 2 === to || from + 3 === to || ((from + 8 === to && [1, 9].some(t => t === from)) || (from - 8 === to && [14, 22].some(t => t === from)))) 
        return ["fromTopAdded", "toBottomRemoved"];
    
    if(from - 2 === to || from - 3 === to || ((from - 8 === to && [9, 17].some(t => t === from)) || (from + 8 === to && [6, 14].some(t => t === from)))) 
        return ["fromBottomAdded", "toTopRemoved"];
    
    return ["", ""];
}

export default animationReducer;