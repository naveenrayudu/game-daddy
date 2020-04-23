import { IAnimationState, IAction, IDaddyGameState } from "../../../common/models/redux-state";
import { DaddyGameTypes } from "../../../common/types";
const initialState: IAnimationState = {};

const animationReducer= (action: IAction, added?: number, deleted?: number) => {
    switch (action.type) {
        case DaddyGameTypes.UPDATE_GAME_POSITIONS:
            if(added !== undefined &&   deleted !== undefined) {
                const addRemoveAnimations = animationType(deleted, added);
                return {
                        [added]: addRemoveAnimations[0]
                } 
            }

            if(added !== undefined)
                    return {
                        [added] : 'insertAdded'
                    }

            if(deleted !== undefined)
                return {
                    [deleted]: 'daddyRemoved'
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