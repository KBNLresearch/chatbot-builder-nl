import ActionTypes from "../action-types";

const initialState = [];


export default function(state=initialState, action) {
    switch (action.type) {
        case ActionTypes.RECEIVE_DIALOGS:
            return action.dialogs;
        default:
    }

    return state;
}