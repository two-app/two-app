import { AxiosError } from "axios";
import Config from "react-native-config";

type ErrorResponseServer = {
  status: string,
  reason: string
};

export type ErrorResponse = ErrorResponseServer & {
  code: number
};

const isErrorResponse = (errorResponse: any): errorResponse is ErrorResponseServer => {
  const hasReason = (errorResponse as ErrorResponseServer).reason != undefined;
  const hasStatus = (errorResponse as ErrorResponseServer).status != undefined;
  return hasReason && hasStatus;
}

export const mapErrorResponse = (error: AxiosError<any>): ErrorResponse => {
  if (!error.response) {
    console.error(`Failed to connect to server. Using API ${Config['API_URL']}.`, error);
    return {
      status: 'Network Error',
      reason: 'Failed to reach Two.',
      code: 500
    }
  } else {
    if (isErrorResponse(error.response.data)) {
      console.error(error.response.data);
      return {...error.response.data, code: error.response.status};
    } else {
      console.error("Server returned a malformed error.", error.response);
      return {
        status: `Error ${error.response.status}`,
        reason: `Something went wrong.`,
        code: 500
      }
    }
  }
};