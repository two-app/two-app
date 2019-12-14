// @flow

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow} from "enzyme";
import AcceptTermsScreen from "../../../src/authentication/register_workflow/AcceptTermsScreen";
import {UserRegistration} from "../../../src/authentication/UserRegistration";

describe('AcceptTermsScreen', () => {
    test('should maintain snapshot', () => expect(renderer.create(<AcceptTermsScreen
        navigation={{getParam: jest.fn()}}/>
    )).toMatchSnapshot());

    let tb: AcceptTermsScreenTestBed;

    beforeEach(() => tb = new AcceptTermsScreenTestBed());

    test('submit button should be disabled with t&c checked', () => {
        tb.tickTermsAndConditions();

        expect(tb.isSubmitEnabled()).toBe(false);
    });

    test('submit button should be disabled with age checked', () => {
        tb.tickAge();

        expect(tb.isSubmitEnabled()).toBe(false);
    });

    test('should enable the submit button with t&c and age accept boxes checked', () => {
        tb.tickTermsAndConditions();
        tb.tickAge();

        expect(tb.isSubmitEnabled()).toBe(true);
    });
});

class AcceptTermsScreenTestBed {
    userRegistration: UserRegistration = {
        firstName: "Gerry",
        lastName: "Fletcher",
        email: "admin@two.com",
        password: "P?4Ot2ONz:IJO&%U"
    };
    wrapper = shallow(<AcceptTermsScreen navigation={{getParam: jest.fn().mockReturnValue(this.userRegistration)}}/>);

    tickTermsAndConditions = () => this.wrapper.find("AcceptBox[id='terms']").prop("onEmit")(true);
    tickAge = () => this.wrapper.find("AcceptBox[id='age']").prop("onEmit")(true);
    isSubmitEnabled = () => !this.wrapper.find("SubmitButton").prop("disabled");
}