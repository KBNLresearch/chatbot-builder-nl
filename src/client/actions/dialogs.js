import xhr from "xhr";
import ActionTypes from "../action-types";

const addDialog = (userText, next) => (dispatch) =>
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
        next(resp.headers['x-uuid']);
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

const togglePartOfMatchPhrase = (uuid, word) => (dispatch) =>
    xhr({
        method: 'PUT',
        url: `/dialogs/${uuid}/toggle-phrase-part`,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({word: word})
    }, (err, resp, body) => {
        dispatch({
            type: ActionTypes.RECEIVE_DIALOGS,
            dialogs: JSON.parse(body)
        });
    });


const addAnswer = ({dialogId, data, parentId}) => (dispatch) =>
    xhr({
        method: 'PUT',
        url: `/dialogs/${dialogId}/add-answer`,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({data: data, parentId: parentId})
    }, (err, resp, body) => {
        dispatch({
            type: ActionTypes.RECEIVE_DIALOGS,
            dialogs: JSON.parse(body)
        });
    });

export { addDialog, fetchDialogs, removeDialog, togglePartOfMatchPhrase, addAnswer }