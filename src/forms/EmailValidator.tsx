/**
 * @param email to verify.
 * @return {boolean} true if the email is valid. False if not, or empty.
 */
function validateEmail(email: string) {
  const re = /^\S+@\S+[.][0-9a-z]+$/;
  return re.test(email);
}

export default {validateEmail};
