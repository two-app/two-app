// @flow

import jwt_decode from "jwt-decode";

class UnconnectedUser {
    uid: number;
    connectCode: number;

    constructor(uid: number, connectCode: number) {
        this.uid = uid;
        this.connectCode = connectCode;
    }

    static fromAccessToken = accessToken => new UnconnectedUser(
        jwt_decode(accessToken)['uid'],
        jwt_decode(accessToken)['connectCode']
    );
}

export {UnconnectedUser};