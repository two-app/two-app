import Gateway from "../http/Gateway";
import { AxiosResponse, AxiosError } from "axios";
import { User } from "../authentication/UserModel";
import { UserProfile } from "./UserService";

/**
 * Retrieves the users partner. Specific function for pre-connection,
 * returning an optional.
 */
const getPartnerPreConnect = () => Gateway.get("/partner")
  .then((response: AxiosResponse<User>): (undefined | User) => response.data)
  .catch((error: AxiosError) => {
    if (error.response?.status === 404) {
      return undefined;
    } else {
      throw new Error("Failed to retrieve users partner.");
    }
  });

const getPartner = () => Gateway.get("/partner")
  .then((response: AxiosResponse<UserProfile>) => response.data);

export default { getPartnerPreConnect, getPartner };