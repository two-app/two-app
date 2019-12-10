// @flow

import validateEmail from "../../src/forms/EmailValidator";

describe('validateEmail', () => {
    test('it should succeed with a valid email', () => expect(validateEmail("admin@two.com")).toBe(true));

    test('it should fail without an @', () => expect(validateEmail("admintwo.com")).toBe(false));

    test('it should fail without a prefix', () => expect(validateEmail("@two.comm")).toBe(false));

    test('it should fail without a domain', () => expect(validateEmail("admin@")).toBe(false));

    test('it should fail for an empty input', () => expect(validateEmail("")).toBe(false));

    test('it should fail for a null input', () => expect(validateEmail(null)).toBe(false));

    test('it should fail for an undefined input', () => expect(validateEmail(undefined)).toBe(false));
});

