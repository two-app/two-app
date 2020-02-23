

import {UnconnectedUser} from "../../src/authentication/UserModel";
import userReducer, {storeUser} from "../../src/authentication/UserReducer";

const payload: UnconnectedUser = new UnconnectedUser(23, "testConnectCode");

test('should create a storeUser action', () => {
    expect(storeUser(payload)).toEqual({
        "type": "STORE_USER",
        "payload": payload
    })
});

describe('storeUser Reducer', () => {
    test('should return initial state', () => {
        expect(userReducer(undefined,{})).toEqual(null);
    });

    test('should store the user', () => {
        expect(userReducer({}, storeUser(payload))).toEqual(payload);
    });
});