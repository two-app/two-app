// @flow

import {createAction, createReducer} from "@reduxjs/toolkit";

const setTokens = createAction("SET_TOKENS");

const authenticationReducer = createReducer(null, {
    [setTokens.type]: (state, action) => ({
        ...state,
        accessToken: action.payload['accessToken'],
        refreshToken: action.payload['refreshToken']
    })
});

export default authenticationReducer;
export {setTokens};