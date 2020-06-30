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
  console.log("Encountered an error with a HTTP response.");
  console.log("--- The Request ---");
  console.log(error.request);
  console.log("---             ---");
  if (!error.response) {
    console.log(`Failed to connect to server. Using API ${Config['API_URL']}.`, error);
    return {
      status: 'Network Error',
      reason: 'Failed to reach Two.',
      code: 500
    }
  } else {
    const response = error.response.data;
    if (isErrorResponse(response)) {
      console.log("Server returned ErrorResponse.", response);
      return {...response, code: error.response.status};
    } else {
      console.log("Server returned a malformed error.", error.response);
      return {
        status: `Error ${error.response.status}`,
        reason: `Something went wrong.`,
        code: 500
      }
    }
  }
};