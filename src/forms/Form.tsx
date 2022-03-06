import {useState} from 'react';

export type Validated<T> = [T, boolean];

export type Form<T> = {
  [key in keyof Required<T>]: Validated<T[key]>;
};

const isValid = <T,>(form: Form<T>): boolean => {
  let valid = true;
  for (const key in form) {
    valid = valid && !!form[key][1];
  }
  return valid;
};

const isInvalid = <T,>(form: Form<T>): boolean => {
  for (const key in form) {
    if (form[key][1] === false) return true;
  }
  return false;
};

const data = <T,>(form: Form<T>): T => {
  const output: any = {};
  for (const key in form) {
    output[key] = form[key][0];
  }
  return output as T;
};

export type F = {
  str: Validated<string>;
  isValid: <T>(f: Form<T>) => boolean;
  isInvalid: <T>(f: Form<T>) => boolean;
  data: <T>(f: Form<T>) => T;
};

const form: F = {
  str: ['', false],
  isValid,
  isInvalid,
  data,
};

export type UpdateInPlace<T> = {
  [key in keyof Partial<T>]: Validated<T[key]>;
};

export function useForm<T>(_form: Form<T>): [
  Form<T>, // The complete form
  T, // The raw form data
  React.Dispatch<React.SetStateAction<Form<T>>>, // setForm hook function
  (u: UpdateInPlace<T>) => void, // helper to update the form using es6 k/v syntax
] {
  const [form, setForm] = useState<Form<T>>(_form);
  const update = (u: UpdateInPlace<T>): void => setForm({...form, ...u});
  return [form, data(form), setForm, update];
}

export default form;
