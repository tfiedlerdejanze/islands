import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import reduxThunk from 'redux-thunk';
import { appReducer } from '../containers/App/reducer';

export default function configureStore() {
    const middleware = applyMiddleware(
        reduxThunk,
    );

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const enhancer = composeEnhancers(
        middleware
    );

    const reducer = combineReducers({
        app: appReducer,
    });

    const store = createStore(reducer, {}, enhancer);

    return store;
}
