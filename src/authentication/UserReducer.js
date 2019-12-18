// @flow

import {createAction, createReducer} from "@reduxjs/toolkit";

const storeUser = createAction("STORE_USER");

const userReducer = createReducer(null, {
    [storeUser.type]: (state = {}, action) => ({...state, ...action.payload})
});

export default userReducer;
export {storeUser};