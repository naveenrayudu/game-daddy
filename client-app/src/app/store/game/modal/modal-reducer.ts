import { IModalState, IAction } from "../../../common/models/redux-state";
import { ModalTypes } from "../../../common/types";

const modalReducer= (state: IModalState = {}, action: IAction) => {
    switch (action.type) {
        case ModalTypes.CREATE_MODAL:
            return {
                content: action.payload.content,
                styles: action.payload.styles || state.styles,
                allowCloseOutsideDoc: action.payload.allowCloseOutsideDoc || true
            }
        case ModalTypes.REMOVE_MODAL:
            return {};
        default:
           return state;
    }
}

export default modalReducer;