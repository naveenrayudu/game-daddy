import {combineReducers, Store, compose} from 'redux';
import {createStore, applyMiddleware} from 'redux';
import reducThunk from 'redux-thunk';
import daddyReducer from './game/daddy/daddy-reducer';
import { IAppState } from '../common/models/redux-state';
import modalReducer from './game/modal/modal-reducer';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers<IAppState>({
    daddyGame: daddyReducer,
    modal: modalReducer
})

const createAndRetrieveStore = (() => {
    var store: Store;
    return () => {
        if(store)
            return store;

        store = createStore(rootReducer, composeEnhancers(applyMiddleware(reducThunk)));
        return store;
    }
})();

export default createAndRetrieveStore();