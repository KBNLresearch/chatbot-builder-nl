import {combineReducers} from "redux";
import dialogs from "./dialogs";
import user from "./user";

export default combineReducers({
    dialogs: dialogs,
    user: user
});
