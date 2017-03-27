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

const updateDialog = (userText, id) => (dispatch) =>
    xhr({
        method: 'PUT',
        url: `/dialogs/${id}/update`,
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

const addStartDialog = () => (dispatch) =>
    xhr({
        method: 'POST',
        url: '/add-start-dialog',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({})
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

const swapAnswer = (answerId, dialogId, direction) => (dispatch) =>
    xhr({
        method: 'PUT',
        url: `/dialogs/${dialogId}/swap-answer`,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({answerId: answerId, direction: direction})
    }, (err, resp, body) => {
        dispatch({
            type: ActionTypes.RECEIVE_DIALOGS,
            dialogs: JSON.parse(body)
        });
    });

const removeAnswer = (answerId, dialogId) => (dispatch) =>
    xhr({
        method: 'PUT',
        url: `/dialogs/${dialogId}/remove-answer`,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({answerId: answerId})
    }, (err, resp, body) => {
        dispatch({
            type: ActionTypes.RECEIVE_DIALOGS,
            dialogs: JSON.parse(body)
        });
    });

const updateAnswer = (dialogId, answerId, data) => (dispatch) =>
    xhr({
        method: 'PUT',
        url: `/dialogs/${dialogId}/update-answer`,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({answerId: answerId, data: data})
    }, (err, resp, body) => {
        dispatch({
            type: ActionTypes.RECEIVE_DIALOGS,
            dialogs: JSON.parse(body)
        });
    });

const importDialogFile = (data) => (dispatch) =>
    xhr({
        method: 'POST',
        url: `/dialogs/import`,
        headers: {
            'Content-type': 'application/json'
        },
        body: data
    }, (err, resp, body) => {
        dispatch({
            type: ActionTypes.RECEIVE_DIALOGS,
            dialogs: JSON.parse(body)
        });
    });

const setGreeting = (greeting) => (dispatch) =>
    xhr({
        method: 'PUT',
        url: `/dialogs/set-greeting`,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({greeting: greeting})
    }, (err, resp, body) => {
        dispatch({
            type: ActionTypes.RECEIVE_DIALOGS,
            dialogs: JSON.parse(body)
        });
    });

export { addDialog, updateDialog, fetchDialogs, removeDialog, togglePartOfMatchPhrase, addAnswer, swapAnswer,
    removeAnswer, importDialogFile, addStartDialog, updateAnswer, setGreeting }