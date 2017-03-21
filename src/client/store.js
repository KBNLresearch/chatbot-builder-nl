import {createStore, applyMiddleware} from "redux";
import thunkMiddleware from "redux-thunk";

import reducers from "./reducers";

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
export default createStoreWithMiddleware(reducers);
