import {UnconnectedUser} from '../../src/authentication/UserModel';
import userReducer, {storeUser} from '../../src/authentication/UserReducer';

const payload: UnconnectedUser = {uid: 23, connectCode: 'testConnectCode'};

test('should create a storeUser action', () => {
    // @ts-ignore
    expect(storeUser(payload)).toEqual({
        'type': 'STORE_USER',
        'payload': payload
    });
});

describe('storeUser Reducer', () => {
    test('should return initial state', () => {
        // @ts-ignore
        expect(userReducer(undefined, {})).toEqual(null);
    });

    test('should store the user', () => {
        // @ts-ignore
        expect(userReducer({}, storeUser(payload))).toEqual(payload);
    });
});