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
        test('should put code on clipboard', () => {
            tb.clickCopyToClipboard();
            expect(tb.clipboardSetStringFn).toHaveBeenCalledWith(tb.user.connectCode);
        });
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
}