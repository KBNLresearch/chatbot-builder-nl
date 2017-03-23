import { addDialog, removeDialog, togglePartOfMatchPhrase, addAnswer, swapAnswer, removeAnswer, importDialogFile } from "./actions/dialogs";


export default function actionsMaker(navigateTo, dispatch) {
    return {
        onAddDialog: (userText) => dispatch(addDialog(userText, (id) => navigateTo('dialogEdit', [id]))),
        onRemoveDialog: (uuid) => dispatch(removeDialog(uuid)),
        onTogglePartOfMatchPhrase: (uuid, word) => dispatch(togglePartOfMatchPhrase(uuid, word)),
        onRedirectToRoot: () => navigateTo('root'),
        onAddAnswer: (params) => dispatch(addAnswer(params)),

        onSwapUp: (answerId, dialogId) => dispatch(swapAnswer(answerId, dialogId, "up")),
        onSwapDown: (answerId, dialogId) => dispatch(swapAnswer(answerId, dialogId, "down")),
        onRemoveAnswer: (answerId, dialogId) => dispatch(removeAnswer(answerId, dialogId)),

        onUpload: (ev) => {
            const reader = new FileReader();

            reader.onload = (e) => { dispatch(importDialogFile(e.target.result)) }

            reader.readAsText(ev.target.files[0]);
        }
    };
};