export type Validated<T> = [T, boolean];
export type ValidatedType = string | number | boolean | Date;

export type Form<T> = {
  [key in keyof T]: Validated<ValidatedType>;
};

export const isFormValid = <T,>(form: Form<T>): boolean => {
  let valid = true;
  for (const key in form) {
    valid = valid && !!form[key][1];
  }
  return valid;
};

export const isFormInvalid = <T,>(form: Form<T>): boolean => {
  for (const key in form) {
    if (form[key][1] === false) {
      console.log(`${key} in form has invalid value ${form[key][0]}`);
      return true;
    }
  }
  return false;
};

export const data = <T,>(form: Form<T>): T => {
  const output: any = {};
  for (const key in form) {
    output[key] = form[key][0];
  }
  return output as T;
};

export type F = {
  str: Validated<string>;
  isFormValid: <T>(f: Form<T>) => boolean;
  isFormInvalid: <T>(f: Form<T>) => boolean;
  data: <T>(f: Form<T>) => T;
};

const form: F = {
  str: ['', false],
  isFormValid,
  isFormInvalid,
  data,
};

export default form;
