

import EmailValidator from "../../src/forms/EmailValidator";

describe('validateEmail', () => {
    test('it should succeed with a valid email', () => expectEmail("admin@two.com").toBe(true));

    test('it should fail without an @', () => expectEmail("admintwo.com").toBe(false));

    test('it should fail without a prefix', () => expectEmail("@two.comm").toBe(false));

    test('it should fail without a domain', () => expectEmail("admin@").toBe(false));

    test('it should fail for an empty input', () => expectEmail("").toBe(false));

    test('it should fail for a null input', () => expectEmail(null).toBe(false));

    test('it should fail for an undefined input', () => expectEmail(undefined).toBe(false));

    const expectEmail = (email) => expect(EmailValidator.validateEmail(email));
});

