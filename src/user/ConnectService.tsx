import PartnerService from "./PartnerService";
import AuthenticationService, { UserResponse } from "../authentication/AuthenticationService";
import { store } from "../state/reducers";
import { storeUser } from "./actions";
import { User, userFromAccessToken } from "../authentication/UserModel";
import { storeTokens } from "../authentication/store";
import { resetNavigate } from "../navigation/NavigationUtilities";
import { getNavigation } from "../navigation/RootNavigation";
import { AxiosResponse } from "axios";
import Gateway from "../http/Gateway";
import { Tokens } from "../authentication/AuthenticationModel";
import { ErrorResponse } from "../http/Response";

const connectToPartner = (connectCode: String): Promise<UserResponse> => Gateway.post(`/partner/${connectCode}`)
  .then((r: AxiosResponse<Tokens>): UserResponse => ({
    user: userFromAccessToken(r.data.accessToken),
    tokens: { accessToken: r.data.accessToken, refreshToken: r.data.refreshToken }
  }));

/**
 * Checks if the user has a partner.
 * If the user does, the tokens are
 * refreshed.
 */
const checkConnection = async (): Promise<void> => PartnerService.getPartnerPreConnect()
  .then(
    () => AuthenticationService.refreshTokens().then(() => { })
  );

const performConnection = (code: string): Promise<void> => {
  return connectToPartner(code)
    // the connection was successful.
    // store the updated user and tokens in redux,
    // then navigate to the home screen.
    .then((response: UserResponse) => {
      store.dispatch(storeUser(response.user as User));
      store.dispatch(storeTokens(response.tokens));
      resetNavigate('HomeScreen', getNavigation() as any);
    }).catch((error: ErrorResponse) => {
      const status = error.code;
      const reason = error.reason;
      if (status === 400 && reason === 'User already has a partner.') {
        // if user already has a partner, refresh the connection
        return checkConnection();
      } else {
        return Promise.reject(error);
      }
    });
};

export default { checkConnection, performConnection };