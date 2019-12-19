import authenticationReducer, {setTokens} from "../../src/authentication/AuthenticationReducer";

const payload = {accessToken: "xyz", refreshToken: "abc"};

test('should create a SET_TOKENS action', () => {
    expect(setTokens(payload)).toEqual({
        "type": "SET_TOKENS",
        "payload": payload
    });
});

describe('setTokens Reducer', () => {
    test('should return initial state', () => {
        expect(authenticationReducer(undefined, {})).toEqual(null);
    });

    test('should set access and refresh token', () => {
        expect(authenticationReducer({}, setTokens(payload))).toEqual(payload);
    });
});

