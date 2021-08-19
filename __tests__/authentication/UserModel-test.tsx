import uuidv4 from 'uuidv4';

import {unconnectedUserFromAccessToken} from '../../src/authentication/UserModel';

describe('created from a JSON Web Token', () => {
  // eslint-disable-next-line max-len
  const tkn = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidWlkIjozMywiY29ubmVjdENvZGUiOiJ0ZXN0Q29ubmVjdENvZGUiLCJpYXQiOjE1MTYyMzkwMjJ9.ODpUUiHwGwNTkHzKXU3eHtUX69q7DfL7G3AVkFSkcew'; // prettier-ignore

  test('extracts uid', () => {
    expect(unconnectedUserFromAccessToken(tkn).uid).toEqual(uuidv4());
  });
});
