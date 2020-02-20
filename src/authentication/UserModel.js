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

class User {
    uid: number;
    pid: number;
    cid: number;

    constructor(uid: number, pid: number, cid: number) {
        this.uid = uid;
        this.pid = pid;
        this.cid = cid;
    }

    static fromAccessToken = accessToken => new User(
        jwt_decode(accessToken)['uid'],
        jwt_decode(accessToken)['pid'],
        jwt_decode(accessToken)['cid']
    )
}

export {UnconnectedUser, User};