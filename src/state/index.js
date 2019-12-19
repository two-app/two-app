// @flow

import {configureStore} from "@reduxjs/toolkit";
import authenticationReducer from "../authentication/AuthenticationReducer";
import userReducer from "../authentication/UserReducer";

const reducer = {
    user: userReducer,
    authentication: authenticationReducer
};

const createReduxStore = () => configureStore({reducer});
export default createReduxStore;