import "react-native-get-random-values";
import uuid from "uuidv4";

import EmailValidator from "../../forms/EmailValidator";

class UserRegistration {
  uid = uuid();
  firstName = "";
  lastName = "";
  email = "";
  password = "";
  acceptedTerms = false;
  ofAge = false;
  receivesEmails = false;
}

const isFirstNameValid = (firstName: string) =>
  firstName !== "" && firstName.length > 1;
const isLastNameValid = (lastName: string) =>
  lastName !== "" && lastName.length > 1;
const isEmailValid = (email: string) =>
  email !== "" && EmailValidator.validateEmail(email);
const isPasswordValid = (password: string) =>
  password !== "" && password.length >= 6;

const isUserRegistrationValid = (ur: UserRegistration): boolean =>
  isFirstNameValid(ur.firstName) &&
  isLastNameValid(ur.lastName) &&
  isEmailValid(ur.email) &&
  isPasswordValid(ur.password);

export default {
  isFirstNameValid,
  isLastNameValid,
  isEmailValid,
  isPasswordValid,
  isUserRegistrationValid,
};
export { UserRegistration };
