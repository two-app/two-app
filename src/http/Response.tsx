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

export const mapErrorResponse = (response: any): ErrorResponse => {
  if (isErrorResponse(response)) {
    return response;
  } else {
    console.log('Server returned a malformed error; not type ErrorResponse.');
    return {status: 500, reason: 'Something went wrong.'};
  }
};
