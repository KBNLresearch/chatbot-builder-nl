import xhr from "xhr";
import ActionTypes from "../action-types";

const receiveDialogs = (body, statusCode, next = () => {}) => (dispatch) => {
    if (statusCode >= 200 && statusCode < 300) {
        dispatch({
            type: ActionTypes.RECEIVE_DIALOGS,
            dialogs: JSON.parse(body)
        });
        next();
    } else {
        dispatch({type: ActionTypes.SET_USERNAME, name: null});
        localStorage.removeItem('token');
    }

};

const addDialog = (userText, next) => (dispatch) =>
    xhr({
        method: 'POST',
        url: '/add-dialog',
        headers: {
            'Content-type': 'application/json',
            'x-fb-token': localStorage.getItem('token')
        },
        body: JSON.stringify({userText: userText})
    }, (err, resp, body) => dispatch(receiveDialogs(body, resp.statusCode, () => next(resp.headers['x-uuid']))));

const updateDialog = (userText, id) => (dispatch) =>
    xhr({
        method: 'PUT',
        url: `/dialogs/${id}/update`,
        headers: {
            'Content-type': 'application/json',
            'x-fb-token': localStorage.getItem('token')
        },
        body: JSON.stringify({userText: userText})
    }, (err, resp, body) => dispatch(receiveDialogs(body, resp.statusCode)));

const addStartDialog = () => (dispatch) =>
    xhr({
        method: 'POST',
        url: '/add-start-dialog',
        headers: {
            'Content-type': 'application/json',
            'x-fb-token': localStorage.getItem('token')
        },
        body: JSON.stringify({})
    }, (err, resp, body) => dispatch(receiveDialogs(body, resp.statusCode)));

const fetchGreeting = () => (dispatch) =>
    xhr({
        method: 'GET',
        url: '/dialogs/get-greeting',
        headers: {
            'x-fb-token': localStorage.getItem('token')
        }
    }, (err, resp, body) => dispatch({type: ActionTypes.SET_GREETING, ...JSON.parse(body)}));


const fetchDialogs = (next = () => {}) => (dispatch) => {

    xhr({
        method: 'GET',
        url: `/check-token?token=${localStorage.getItem('token')}`
    }, (err, resp, body) => {
        const { tokenOk, name } = JSON.parse(body);

        if (tokenOk === true) {
            dispatch({type: ActionTypes.SET_USERNAME, name: name});
            xhr({
                method: 'GET',
                url: '/dialogs',
                headers: {
                    'x-fb-token': localStorage.getItem('token')
                }
            }, (err, resp, body) => dispatch(receiveDialogs(body, resp.statusCode)));

            dispatch(fetchGreeting());
        } else {
            dispatch({type: ActionTypes.SET_USERNAME, name: null});
        }
        next();

    })
};

const removeDialog = (uuid) => (dispatch) =>
    xhr({
        method: 'DELETE',
        url: `/dialogs/${uuid}`,
        headers: {
            'x-fb-token': localStorage.getItem('token')
        }
    }, (err, resp, body) => dispatch(receiveDialogs(body, resp.statusCode)));

const togglePartOfMatchPhrase = (uuid, word) => (dispatch) =>
    xhr({
        method: 'PUT',
        url: `/dialogs/${uuid}/toggle-phrase-part`,
        headers: {
            'Content-type': 'application/json',
            'x-fb-token': localStorage.getItem('token')
        },
        body: JSON.stringify({word: word})
    }, (err, resp, body) => dispatch(receiveDialogs(body, resp.statusCode)));


const addAnswer = ({dialogId, data, parentId}) => (dispatch) =>
    xhr({
        method: 'PUT',
        url: `/dialogs/${dialogId}/add-answer`,
        headers: {
            'Content-type': 'application/json',
            'x-fb-token': localStorage.getItem('token')
        },
        body: JSON.stringify({data: data, parentId: parentId})
    }, (err, resp, body) => dispatch(receiveDialogs(body, resp.statusCode)));

const swapAnswer = (answerId, dialogId, direction) => (dispatch) =>
    xhr({
        method: 'PUT',
        url: `/dialogs/${dialogId}/swap-answer`,
        headers: {
            'Content-type': 'application/json',
            'x-fb-token': localStorage.getItem('token')
        },
        body: JSON.stringify({answerId: answerId, direction: direction})
    }, (err, resp, body) => dispatch(receiveDialogs(body, resp.statusCode)));

const removeAnswer = (answerId, dialogId) => (dispatch) =>
    xhr({
        method: 'PUT',
        url: `/dialogs/${dialogId}/remove-answer`,
        headers: {
            'Content-type': 'application/json',
            'x-fb-token': localStorage.getItem('token')
        },
        body: JSON.stringify({answerId: answerId})
    }, (err, resp, body) => dispatch(receiveDialogs(body, resp.statusCode)));

const updateAnswer = (dialogId, answerId, data) => (dispatch) =>
    xhr({
        method: 'PUT',
        url: `/dialogs/${dialogId}/update-answer`,
        headers: {
            'Content-type': 'application/json',
            'x-fb-token': localStorage.getItem('token')
        },
        body: JSON.stringify({answerId: answerId, data: data})
    }, (err, resp, body) => dispatch(receiveDialogs(body, resp.statusCode)));

const importDialogFile = (data) => (dispatch) =>
    xhr({
        method: 'POST',
        url: `/dialogs/import`,
        headers: {
            'Content-type': 'application/json',
            'x-fb-token': localStorage.getItem('token')
        },
        body: data
    }, (err, resp, body) => dispatch(receiveDialogs(body, resp.statusCode)));

const setGreeting = (greeting) => (dispatch) =>
    xhr({
        method: 'PUT',
        url: `/dialogs/set-greeting`,
        headers: {
            'Content-type': 'application/json',
            'x-fb-token': localStorage.getItem('token')
        },
        body: JSON.stringify({greeting: greeting})
    }, (err, resp, body) => {
        dispatch(fetchGreeting());
        dispatch(receiveDialogs(body, resp.statusCode));
    });

export { addDialog, updateDialog, fetchDialogs, removeDialog, togglePartOfMatchPhrase, addAnswer, swapAnswer,
    removeAnswer, importDialogFile, addStartDialog, updateAnswer, setGreeting }