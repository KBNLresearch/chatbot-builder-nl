import ActionTypes from "../action-types";

const initialState = {};


export default function(state=initialState, action) {
    switch (action.type) {
        case ActionTypes.SET_USERNAME:
            return {
                username: action.name
            };
        default:
    }

    return state;
}