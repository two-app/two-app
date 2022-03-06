export const validateEmail = (email: string): boolean => {
  const re = /^\S+@\S+[.][0-9a-z]+$/;
  return re.test(email);
};

export const validateDate = (date: string): boolean => {
  const re = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
  return re.test(date);
};
