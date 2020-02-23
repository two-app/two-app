import jwt_decode from 'jwt-decode';

// @ts-ignore
const decode = (token: string): any => jwt_decode(token);

class UnconnectedUser {
    uid: number;
    connectCode: string;

    constructor(uid: number, connectCode: string) {
        this.uid = uid;
        this.connectCode = connectCode;
    }
    // @ts-ignore
    static fromAccessToken = (accessToken: string) => new UnconnectedUser(
        decode(accessToken)['uid'],
        decode(accessToken)['connectCode']
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

    static fromAccessToken = (accessToken: string) => new User(
        decode(accessToken)['uid'],
        decode(accessToken)['pid'],
        decode(accessToken)['cid']
    );
}

export {UnconnectedUser, User};