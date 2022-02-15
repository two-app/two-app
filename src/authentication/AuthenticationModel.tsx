export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type UserRegistration = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string;
  acceptedTerms: boolean;
};
