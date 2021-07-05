import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers/index';

const initialState = {};
const middleware = [thunk];

// Development
// const store = createStore(
//     rootReducer, 
//     initialState,
//     compose(
//         applyMiddleware(...middleware),
//         (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) || compose
//     )
// );

// Production
const store = createStore(
    rootReducer, 
    initialState, 
    applyMiddleware(...middleware)
);

export default store;