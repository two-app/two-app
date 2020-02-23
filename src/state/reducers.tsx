import authenticationReducer from '../authentication/AuthenticationReducer';
import userReducer from '../authentication/UserReducer';
import AsyncStorage from '@react-native-community/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import {Action, combineReducers, createStore} from 'redux';
// import {createAction} from '@reduxjs/toolkit';
import {action, createReducer} from 'typesafe-actions';
import {Persistor} from 'redux-persist/es/types';
import { DeepReadonly } from 'utility-types';




// export type TwoState = DeepReadonly<{
//     user?: {
//         uid: number,
//         pid?: number,
//         cid?: number,
//         connectCode?: string
//     },
//     auth?: {
//         accessToken: string,
//         refreshToken: string
//     }
// }>;
//
// const initialState: TwoState = {};
//
// export default combineReducers<TwoState,








const persistConfig = {
    key: 'root',
    storage: AsyncStorage
};

const reducer = combineReducers({
    user: userReducer,
    authentication: authenticationReducer
});

const clearState = action('CLEAR_STATE');

const rootReducer = (state: any, action: Action) => {
    if (action.type === clearState.type) {
        state = undefined;
    }
    return reducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer);
const persistor: Persistor = persistStore(store);
export {store, persistor, clearState};