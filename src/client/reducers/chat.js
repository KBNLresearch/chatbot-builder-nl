import ActionTypes from "../action-types";

const initialState = {
    responses: [],
    typingOn: false,
    greeting: null
};


export default function(state=initialState, action) {
    switch (action.type) {
        case ActionTypes.SET_GREETING:
            return {...state, greeting: action.greeting};
        case ActionTypes.CLEAR_CHAT:
            return {...state, typingOn: false, responses: []};
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