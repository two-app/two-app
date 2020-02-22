// @flow

import authenticationReducer from "../authentication/AuthenticationReducer";
import userReducer from "../authentication/UserReducer";
import AsyncStorage from '@react-native-community/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import {combineReducers, createStore} from "redux";
import {createAction} from "@reduxjs/toolkit";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
};

const reducer = combineReducers({
    user: userReducer,
    authentication: authenticationReducer
});

const clearState = createAction("CLEAR_STATE");
const rootReducer = (state, action) => {
    if (action.type === clearState.type) {
        state = undefined;
    }
    return reducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);
export {store, persistor, clearState};