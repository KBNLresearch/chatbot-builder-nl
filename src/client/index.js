import React from "react";
import {Router, Route, IndexRoute, browserHistory} from "react-router";
import {Provider, connect} from "react-redux";
import store from "./store";
import actions from "./actions";
import ReactDOM from "react-dom";
import App from "./components/app"
import {fetchDialogs} from "./actions/dialogs";

const urls = {};
const navigateTo = (key, args) => browserHistory.push(urls[key].apply(null, args));

const connectComponent = (stateToProps) => connect(stateToProps, dispatch => actions(navigateTo, dispatch));


store.dispatch(fetchDialogs(() =>
    ReactDOM.render((
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/" component={connectComponent(state => state)(App)}>
                </Route>
            </Router>
        </Provider>
    ), document.getElementById("app"))
));