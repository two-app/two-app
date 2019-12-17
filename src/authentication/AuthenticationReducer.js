// @flow

import {createAction, createReducer} from "@reduxjs/toolkit";

const setTokens = createAction("SET_TOKENS");

const authenticationReducer = createReducer(null, {
    [setTokens.type]: (state, action) => ({
        ...state, authentication: {
            ...state.authentication,
            accessToken: action.payload['access_token'],
            refreshToken: action.payload['refresh_token']
        }
    })
});

export default authenticationReducer;
export {setTokens};