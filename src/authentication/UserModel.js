// @flow

import jwt_decode from "jwt-decode";

const UnconnectedUser: {
    uid: number,
    connectCode: string
} = {
    uid: null,
    connectCode: null
};

const createUnconnectedUser = (uid: number, connectCode: string): UnconnectedUser => ({uid, connectCode});

const parseUnconnectedUserFromToken = (accessToken: string): (UnconnectedUser) => {
    const decoded = jwt_decode(accessToken);
    const uid = decoded['uid'];
    const connectCode = decoded['connectCode'];

    return createUnconnectedUser(uid, connectCode);
};

export {UnconnectedUser, createUnconnectedUser, parseUnconnectedUserFromToken};