import Gateway from "../http/Gateway";
import { AxiosResponse, AxiosError } from "axios";
import { User } from "../authentication/UserModel";

/**
 * Retrieves the users partner. Specific function for pre-connection,
 * returning an optional.
 */
const getPartnerPreConnect = () => Gateway.get("/partner").then((response: AxiosResponse<User>): (undefined | User) => {
  console.log(response);
  console.log(response.data);
  return response.data;
}).catch((error: AxiosError) => {
  if (error.response?.status === 404) {
    return undefined;
  } else {
    throw new Error("Failed to retrieve users partner.");
  }
});

export default { getPartnerPreConnect };