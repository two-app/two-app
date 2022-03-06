import {validateEmail} from '../../src/forms/Validators';

describe('validateEmail', () => {
  test('it should succeed with a valid email', () =>
    expectEmail('admin@two.com').toBe(true));

  test('it should fail without an @', () =>
    expectEmail('admintwo.com').toBe(false));

  test('it should fail without a prefix', () =>
    expectEmail('@two.comm').toBe(false));

  test('it should fail without a domain', () =>
    expectEmail('admin@').toBe(false));

  test('it should fail for an empty input', () => expectEmail('').toBe(false));

  const expectEmail = (email: string) => expect(validateEmail(email));
});
