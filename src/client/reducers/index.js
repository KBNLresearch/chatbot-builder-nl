import {combineReducers} from "redux";
import dialogs from "./dialogs";
import user from "./user";
import chat from "./chat";

export default combineReducers({
    dialogs: dialogs,
    chat: chat,
    user: user
});
