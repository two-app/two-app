import { unconnectedUserFromAccessToken } from "../../src/authentication/UserModel";

describe("created from a JSON Web Token", () => {
  const uid = "7d1c7359-04d8-4703-9660-932939abc5dd";
  // eslint-disable-next-line max-len
  const tkn = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidWlkIjoiN2QxYzczNTktMDRkOC00NzAzLTk2NjAtOTMyOTM5YWJjNWRkIiwiaWF0IjoxNTE2MjM5MDIyfQ.nEVuVDumvc1BbNx-JilLYc6Myn0vanpW12bPK3IyES8'; // prettier-ignore

  test("extracts uid", () => {
    expect(unconnectedUserFromAccessToken(tkn).uid).toEqual(uid);
  });
});
