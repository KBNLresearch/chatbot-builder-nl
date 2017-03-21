import { addDialog, removeDialog} from "./actions/dialogs";
export default function actionsMaker(navigateTo, dispatch) {
    return {
        onAddDialog: (userText) => dispatch(addDialog(userText)),
        onRemoveDialog: (uuid) => dispatch(removeDialog(uuid))
    };
};