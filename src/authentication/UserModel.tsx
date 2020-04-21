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

export const detectUserFromAccessToken = (accessToken: string): (User | UnconnectedUser) => {
    const role: string = decode(accessToken)['role'];
    if (role.toLowerCase() == 'connect') {
        return unconnectedUserFromAccessToken(accessToken);
    } else {
        return userFromAccessToken(accessToken);
    }
}

/**
 * @param user {User | UnconnectedUser}  narrows the type based if the connect code is present.
 */
export const isUnconnectedUser = (user: User | UnconnectedUser): user is UnconnectedUser => {
    return (user as UnconnectedUser).connectCode !== undefined;
}