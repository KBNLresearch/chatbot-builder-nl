import ActionTypes from "../action-types";

const initialState = {
    responses: [],
    typingOn: false
};


export default function(state=initialState, action) {
    switch (action.type) {
        case ActionTypes.CLEAR_CHAT:
            return initialState;
        case ActionTypes.RECEIVE_CHAT_RESPONSE:
            if (action.responseType === 'sendTypingOn') {
                return {
                    ...state,
                    typingOn: true
                };
            } else if (action.responseType === 'sendTypingOff') {
                return {
                    ...state,
                    typingOn: false
                };
            } else {
                return {
                    ...state,
                    responses: state.responses.concat({
                        responseData: action.responseData,
                        responseType: action.responseType
                    })
                };
            }
        default:
    }

    return state;
}