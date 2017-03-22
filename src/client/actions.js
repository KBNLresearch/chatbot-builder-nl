import { addDialog, removeDialog, togglePartOfMatchPhrase, addAnswer } from "./actions/dialogs";


export default function actionsMaker(navigateTo, dispatch) {
    return {
        onAddDialog: (userText) => dispatch(addDialog(userText, (id) => navigateTo('dialogEdit', [id]))),
        onRemoveDialog: (uuid) => dispatch(removeDialog(uuid)),
        onTogglePartOfMatchPhrase: (uuid, word) => dispatch(togglePartOfMatchPhrase(uuid, word)),
        onRedirectToRoot: () => navigateTo('root'),
        onAddAnswer: (params) => dispatch(addAnswer(params))
    };
};