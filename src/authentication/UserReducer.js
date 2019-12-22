// @flow

import {createAction, createReducer} from "@reduxjs/toolkit";

const storeUser = createAction("STORE_USER");

const userReducer = createReducer(null, {
    [storeUser.type]: (state = {}, {payload}) => ({
        ...state,
        uid: payload.uid,
        connectCode: payload.connectCode
    })
});

export default userReducer;
export {storeUser};