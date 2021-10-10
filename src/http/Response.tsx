import type {AxiosError} from 'axios';
import Config from 'react-native-config';

export type ErrorResponse = {
  status: number;
  reason: string;
};

const isErrorResponse = (
  errorResponse: any,
): errorResponse is ErrorResponse => {
  const hasReason = (errorResponse as ErrorResponse).reason !== undefined;
  const hasStatus = (errorResponse as ErrorResponse).status !== undefined;
  return hasReason && hasStatus;
};

export const mapErrorResponse = (error: AxiosError<any>): ErrorResponse => {
  console.log('Encountered an error with a HTTP response.');
  console.log('--- The Request  ---');
  console.log(JSON.stringify(error.request));
  console.log('--- The Response ---');
  console.log(JSON.stringify(error.response));
  console.log('~~~   Meta Inf   ~~~');
  if (!error.response) {
    console.log(
      `Failed to connect to server. Using API ${Config.API_URL}.`,
      error,
    );
    return {
      status: 500,
      reason: 'Failed to reach Two.',
    };
  } else {
    const response = error.response.data;
    if (isErrorResponse(response)) {
      console.log(`Parsed ErrorResponse: ${response}`);
      return response;
    } else {
      console.log('Server returned a malformed error; not type ErrorResponse.');
      return {
        status: 500,
        reason: 'Something went wrong.',
      };
    }
  }
};
