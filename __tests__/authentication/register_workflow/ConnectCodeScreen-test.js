// @flow

import 'react-native';
import {Clipboard} from "react-native";
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow} from "enzyme";
import {UnconnectedUser} from "../../../src/authentication/UserModel";
import {ConnectCodeScreen} from "../../../src/authentication/register_workflow/ConnectCodeScreen";

describe('ConnectCodeScreen', () => {
    let tb: ConnectCodeScreenTestBed;
    beforeEach(() => tb = new ConnectCodeScreenTestBed());

    test('should maintain snapshot', () => expect(renderer.create(
        <ConnectCodeScreen user={tb.user}/>
    )).toMatchSnapshot());

    describe('Tapping the Connect Code', () => {
        beforeEach(() => tb.clickCopyToClipboard());

        test('puts code in clipboard', () => expect(tb.clipboardSetStringFn).toHaveBeenCalledWith(tb.user.connectCode));
    });

    describe('When entered partner code is identical to users code', () => {
        beforeEach(() => tb.setPartnerCodeInput(tb.user.connectCode));

        test('displays error', () => expect(
            tb.wrapper.find("Text[id='error']").render().text()
        ).toEqual("You can't connect with yourself!"));

        test('validates input', () => expect(tb.wrapper.find("Input").prop("isValid")()).toBe(false));
    });
});

class ConnectCodeScreenTestBed {
    user = new UnconnectedUser(12, "testConnect");
    clipboardSetStringFn = jest.fn();
    wrapper = shallow(<ConnectCodeScreen user={this.user}/>);

    constructor() {
        Clipboard.setString = this.clipboardSetStringFn;
    }

    clickCopyToClipboard = () => this.wrapper.find("TouchableOpacity").prop("onPress")();
    setPartnerCodeInput = v => this.wrapper.find("Input").prop("onChange")(v);
}