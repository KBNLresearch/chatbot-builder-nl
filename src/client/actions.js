import { addDialog, updateDialog, removeDialog, togglePartOfMatchPhrase, addAnswer, swapAnswer, removeAnswer,
    importDialogFile, addStartDialog, updateAnswer, setGreeting } from "./actions/dialogs";

import ActionTypes from "./action-types";

export default function actionsMaker(navigateTo, dispatch, sendToSocket) {
    return {
        onSetGreeting: (greeting) => dispatch(setGreeting(greeting)),

        onAddDialog: (userText) => dispatch(addDialog(userText, (id) => navigateTo('dialogEdit', [id]))),
        onUpdateDialog: (userText, id) => dispatch(updateDialog(userText, id)),
        onCreateStartDialog: () => dispatch(addStartDialog()),

        onRemoveDialog: (uuid) => dispatch(removeDialog(uuid)),
        onTogglePartOfMatchPhrase: (uuid, word) => dispatch(togglePartOfMatchPhrase(uuid, word)),
        onRedirectToRoot: () => navigateTo('root'),
        onAddAnswer: (params) => dispatch(addAnswer(params)),

        onSwapUp: (answerId, dialogId) => dispatch(swapAnswer(answerId, dialogId, "up")),
        onSwapDown: (answerId, dialogId) => dispatch(swapAnswer(answerId, dialogId, "down")),
        onRemoveAnswer: (answerId, dialogId) => dispatch(removeAnswer(answerId, dialogId)),
        onUpdateAnswer: (dialogId, answerId, data) => dispatch(updateAnswer(dialogId, answerId, data)),

        onClearChat: () => dispatch({type: ActionTypes.CLEAR_CHAT }),
        onSendChatMessage: (type, data, buttonText) => {
            dispatch({
                type: ActionTypes.RECEIVE_CHAT_RESPONSE,
                responseType: "userMessage",
                responseData: {
                    responseText: buttonText || data,
                }
            });
            sendToSocket(type, data)
        },

        onUpload: (ev) => {
            const reader = new FileReader();

            reader.onload = (e) => { dispatch(importDialogFile(e.target.result)) }

            reader.readAsText(ev.target.files[0]);
        }
    };
};