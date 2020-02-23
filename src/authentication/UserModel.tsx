import jwt_decode from 'jwt-decode';

// @ts-ignore
const decode = (token: string): any => jwt_decode(token);

export type UnconnectedUser = {
    uid: number,
    connectCode: string
}

export const unconnectedUserFromAccessToken = (accessToken: string): UnconnectedUser => ({
    uid: decode(accessToken)['uid'],
    connectCode: decode(accessToken)['connectCode']
});

export type User = {
    uid: number,
    pid: number,
    cid: number
}

export const userFromAccessToken = (accessToken: string): User => ({
    uid: decode(accessToken)['uid'],
    pid: decode(accessToken)['pid'],
    cid: decode(accessToken)['cid']
});