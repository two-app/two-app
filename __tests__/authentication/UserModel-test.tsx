import {UnconnectedUser, unconnectedUserFromAccessToken, userFromAccessToken} from '../../src/authentication/UserModel';

describe('created from a JSON Web Token', () => {

    const tkn = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidWlkIjozMywiY29ubmVjdENvZGUiOiJ0ZXN0Q29ubmVjdENvZGUiLCJpYXQiOjE1MTYyMzkwMjJ9.ODpUUiHwGwNTkHzKXU3eHtUX69q7DfL7G3AVkFSkcew';

    test('extracts uid', () => expect(unconnectedUserFromAccessToken(tkn).uid).toEqual(33));
    test('extracts connect code', () => expect(unconnectedUserFromAccessToken(tkn).connectCode).toEqual('testConnectCode'));
});