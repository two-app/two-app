import 'react-native';
import {Clipboard} from 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';
import {UnconnectedUser, User} from '../../../src/authentication/UserModel';
import {ConnectCodeScreen} from '../../../src/authentication/register_workflow/ConnectCodeScreen';
import AuthenticationService, {UserResponse} from '../../../src/authentication/AuthenticationService';
import {Tokens} from '../../../src/authentication/AuthenticationModel';
import {NavigationActions, StackActions} from 'react-navigation';

describe('ConnectCodeScreen', () => {
    let tb: ConnectCodeScreenTestBed;
    beforeEach(() => tb = new ConnectCodeScreenTestBed());

    test('should maintain snapshot', () => expect(renderer.create(
        <ConnectCodeScreen navigation={{} as any}
                           setTokens={() => null}
                           storeUser={() => null}
                           user={tb.user}/>
    )).toMatchSnapshot());

    describe('Tapping the Connect Code', () => {
        beforeEach(() => tb.clickCopyToClipboard());

        test('puts code in clipboard', () => expect(tb.clipboardSetStringFn).toHaveBeenCalledWith(tb.user.connectCode));
    });

    describe('By Default', () => {
        test('submit is disabled', () => expect(tb.isSubmitButtonDisabled()).toBe(true));
    });

    describe('When entered partner code is identical to users code', () => {
        beforeEach(() => tb.setPartnerCodeInput(tb.user.connectCode));

        test('displays error', () => expect(
            tb.getErrorText()
        ).toEqual('You can\'t connect with yourself!'));

        test('validates input', () => expect(tb.isPartnerCodeValid()).toBe(false));

        test('disables submit', () => expect(tb.isSubmitButtonDisabled()).toBe(true));
    });

    describe('When entered code is not 6 characters in length', () => {
        beforeEach(() => tb.setPartnerCodeInput('ab'));

        test('disables submit', () => expect(tb.isSubmitButtonDisabled()).toBe(true));
    });

    describe('When entered code is valid', () => {
        beforeEach(() => tb.setPartnerCodeInput('ghijkl'));

        test('enables submit', () => expect(tb.isSubmitButtonDisabled()).toBe(false));

        test('displays loading view on submit', () => {
            tb.clickSubmit();
            expect(tb.wrapper.exists('LoadingView')).toBe(true);
        });

        describe('On successful connect', () => {
            const response = new UserResponse(new User(1, 2, 3), new Tokens('testAccess', 'testRefresh'));
            beforeEach(() => {
                tb.whenConnectResolve(response);
                tb.clickSubmit();
            });

            test('stores user in redux', done => setImmediate(() => {
                expect(tb.storeUserFn).toHaveBeenCalledWith({...response.user});
                done();
            }));

            test('stores tokens in redux', done => setImmediate(() => {
                expect(tb.setTokensFn).toHaveBeenCalledWith({...response.tokens});
                done();
            }));

            test('navigates to Home Screen', done => setImmediate(() => {
                expect(tb.dispatchFn).toHaveBeenCalledWith(
                    StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({routeName: 'HomeScreen'})]
                    })
                );
                done();
            }));
        });

        describe('On failed connect', () => {
            const response = new Error('Error Message');
            beforeEach(() => {
                tb.whenConnectReject(response);
                tb.clickSubmit();
            });

            test('hides loading view', () => expect(tb.wrapper.exists('LoadingView')).toBe(false));

            test('displays error message', () => expect(tb.getErrorText()).toEqual(response.message));
        });
    });
});

class ConnectCodeScreenTestBed {
    user = new UnconnectedUser(12, 'abcdef');
    clipboardSetStringFn = jest.fn();
    setTokensFn = jest.fn();
    storeUserFn = jest.fn();
    dispatchFn = jest.fn();

    wrapper = shallow(
        <ConnectCodeScreen user={this.user}
                           setTokens={this.setTokensFn}
                           storeUser={this.storeUserFn}
                           navigation={{dispatch: this.dispatchFn} as any}
        />);

    constructor() {
        Clipboard.setString = this.clipboardSetStringFn;
    }

    clickCopyToClipboard = () => this.wrapper.find('TouchableOpacity').prop<() => void>('onPress')();
    setPartnerCodeInput = (v: string) => this.wrapper.find('Input').prop<(v: string) => void>('onChange')(v);
    isPartnerCodeValid = () => this.wrapper.find('Input').prop<() => boolean>('isValid')();
    isSubmitButtonDisabled = () => this.wrapper.find('SubmitButton').prop<boolean>('disabled');
    clickSubmit = () => this.wrapper.find('SubmitButton').prop<() => void>('onSubmit')();
    getErrorText = () => this.wrapper.find('Text[data-testid=\'error\']').render().text();

    whenConnectResolve = (userResponse: UserResponse) => {
        AuthenticationService.connectToPartner = jest.fn().mockResolvedValue(userResponse);
    };

    whenConnectReject = (error: Error) => {
        AuthenticationService.connectToPartner = jest.fn().mockRejectedValue(error);
    };
}