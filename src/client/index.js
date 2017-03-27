import React from "react";
import {Router, Route, IndexRoute, browserHistory} from "react-router";
import {Provider, connect} from "react-redux";
import store from "./store";
import actions from "./actions";
import ReactDOM from "react-dom";
import App from "./components/app"
import DialogEdit from "./components/dialogues/dialog-edit";
import {fetchDialogs} from "./actions/dialogs";

import urls from "./urls";

const navigateTo = (key, args) => browserHistory.push(urls[key].apply(null, args));

const connectComponent = (stateToProps) => connect(stateToProps, dispatch => actions(navigateTo, dispatch));

const connectDialogEdit = (state, routed) => ({
    dialog: state.dialogs.filter(d => d.id === routed.params.id)[0]
});



if (window.location.href.indexOf("token=") > -1) {
    const { token } = window.location.href
        .replace(/^[^\?]+\?(.*)#/, "$1")
        .split("&")
        .map(chunk => ({
            key: chunk.split("=")[0],
            value: chunk.split("=")[1]
        })).reduce((accum, cur) => {
            accum[cur.key] = cur.value;
            return accum;
        }, {});

    localStorage.setItem('token', token);
    window.location.href = "/";
} else {
    store.dispatch(fetchDialogs(() =>
        ReactDOM.render((
            <Provider store={store}>
                <Router history={browserHistory}>
                    <Route path="/" component={connectComponent(state => state)(App)}>
                        <Route path={urls.dialogEdit()} components={connectComponent(connectDialogEdit)(DialogEdit)}/>
                    </Route>
                </Router>
            </Provider>
        ), document.getElementById("app"))
    ));
}
export { urls }