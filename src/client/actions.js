import { addDialog, updateDialog, removeDialog, togglePartOfMatchPhrase, addAnswer, swapAnswer, removeAnswer,
    importDialogFile, addStartDialog, updateAnswer } from "./actions/dialogs";


export default function actionsMaker(navigateTo, dispatch) {
    return {
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

        onUpload: (ev) => {
            const reader = new FileReader();

            reader.onload = (e) => { dispatch(importDialogFile(e.target.result)) }

            reader.readAsText(ev.target.files[0]);
        }
    };
};