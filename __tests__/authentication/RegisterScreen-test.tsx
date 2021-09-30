import { Text } from "react-native";
import React from "react";
import type { QueryReturn, RenderAPI } from "@testing-library/react-native";
import {
  waitForElementToBeRemoved,
  fireEvent,
  render,
} from "@testing-library/react-native";

import RegisterScreen from "../../src/authentication/RegisterScreen";
import EmailValidator from "../../src/forms/EmailValidator";
import { UserRegistration } from "../../src/authentication/register_workflow/UserRegistrationModel";
import {
  mockNavigation,
  resetMockNavigation,
} from "../utils/NavigationMocking";

describe("RegisterScreen", () => {
  let tb: RegisterScreenTestBed;

  beforeEach(() => (tb = new RegisterScreenTestBed().build()));

  describe("Form Validation", () => {
    const cases: Array<[string, string, boolean]> = [
      ["First Name", "a", false],
      ["First Name", "abc", true],
      ["Last Name", "x", false],
      ["Last Name", "xyz", true],
      ["Password", "pass", false],
      ["Password", "password", true],
      ["Password", "P?4Ot2ONz:IJO&%U", true],
    ];

    test.each(cases)(
      "Input %s with value %s should be valid: %s",
      (label: string, text: string, expectedToBeValid: boolean) => {
        // GIVEN
        const input = tb.render.getByA11yLabel(label);

        // WHEN
        fireEvent.changeText(input, text);
        fireEvent(input, "blur");

        // THEN the input should be invalid
        expect(input.props.accessibilityValue).toEqual({
          text: expectedToBeValid ? "Valid entry" : "Invalid entry",
        });

        // THEN the submit button should be disabled
      }
    );

    const emailCases: Array<[string, boolean]> = [
      ["abc", false],
      ["abc@gmail.com", true],
    ];

    test.each(emailCases)(
      "Input Email with value %s should be valid: %s",
      (email: string, expectedToBeValid: boolean) => {
        // GIVEN
        tb.mockEmailValid(expectedToBeValid);
        const input = tb.render.getByA11yLabel("Email");

        // WHEN
        fireEvent.changeText(input, email);
        fireEvent(input, "blur");

        // THEN
        expect(input.props.accessibilityValue).toEqual({
          text: expectedToBeValid ? "Valid entry" : "Invalid entry",
        });
      }
    );
  });

  describe("Valid form", () => {
    test("Pressing submit should navigate to AcceptTermsScreen", () => {
      // GIVEN
      const inputs = [
        ["First Name", "Paul"],
        ["Last Name", "Atreides"],
        ["Email", "paul@arrakis.com"],
        ["Password", "P?4Ot2ONz:IJO&%U"],
      ];
      tb.mockEmailValid(true);

      // WHEN
      inputs.forEach(([label, text]) => {
        const input = tb.render.getByA11yLabel(label);
        fireEvent.changeText(input, text);
        fireEvent(input, "blur");
      });

      tb.pressSubmit();

      expect(mockNavigation.navigate).toHaveBeenCalledWith(
        "AcceptTermsScreen",
        {
          userRegistration: {
            ...new UserRegistration(),
            email: "paul@arrakis.com",
            firstName: "Paul",
            lastName: "Atreides",
            password: "P?4Ot2ONz:IJO&%U",
            uid: expect.any(String),
          },
        }
      );
    });
  });
});

class RegisterScreenTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  // elements
  submitButton = () => this.render.getByA11yLabel("Press to Register");

  // queries
  isSubmitEnabled = (): boolean =>
    !this.submitButton().props.accessibilityState.disabled;

  queryLoadingScreen = (): QueryReturn => {
    return this.render.queryByA11yHint("Waiting for an action to finish...");
  };

  // events
  pressSubmit = async () => {
    fireEvent.press(this.submitButton());
    await waitForElementToBeRemoved(this.queryLoadingScreen);
  };

  // mocks
  mockEmailValid = (valid: boolean) => {
    EmailValidator.validateEmail = jest.fn().mockReturnValue(valid);
  };

  build = (): RegisterScreenTestBed => {
    resetMockNavigation();
    this.render = render(<RegisterScreen />);
    return this;
  };
}
