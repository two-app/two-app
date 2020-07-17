import Gateway from "../http/Gateway";
import { User } from "../authentication/UserModel";
import { AxiosResponse } from 'axios';

export type UserProfile = User & {
  firstName: string,
  lastName: string
}

const getSelf = (): Promise<UserProfile> => Gateway.get("/self")
  .then((response: AxiosResponse<UserProfile>) => {
    return response.data;
  });

export default { getSelf };
