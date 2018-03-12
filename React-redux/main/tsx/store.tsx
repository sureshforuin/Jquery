import { applyMiddleware, compose, createStore, Middleware } from 'redux';
import * as createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import allReducers from './reducers';

// const logger: Middleware = store => next => action => {
//     console.groupCollapsed(`Dispatching: ${action.type}`);
//     const result = next(action);
//     console.log(result);
//     console.groupEnd();
//     return result;
// };

const enhancer = compose(
    applyMiddleware (
        thunk,
        createLogger()
    )
);
const configureStore = (initialState = {}) => createStore(allReducers, initialState, enhancer);

export default configureStore;