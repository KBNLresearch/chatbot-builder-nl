import xhr from "xhr";
import ActionTypes from "../action-types";

const addDialog = (userText) => (dispatch) =>
    xhr({
        method: 'POST',
        url: '/add-dialog',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({userText: userText})
    }, (err, resp, body) => {
        dispatch({
            type: ActionTypes.RECEIVE_DIALOGS,
            dialogs: JSON.parse(body)
        });
    });


const fetchDialogs = (next = () => {}) => (dispatch) =>
    xhr({
        method: 'GET',
        url: '/dialogs',
    }, (err, resp, body) => {
        dispatch({
            type: ActionTypes.RECEIVE_DIALOGS,
            dialogs: JSON.parse(body)
        });

        next();
    });

const removeDialog = (uuid) => (dispatch) =>
    xhr({
        method: 'DELETE',
        url: `/dialogs/${uuid}`,
    }, (err, resp, body) => {
        dispatch({
            type: ActionTypes.RECEIVE_DIALOGS,
            dialogs: JSON.parse(body)
        });
    });

export { addDialog, fetchDialogs, removeDialog }