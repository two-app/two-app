import React from 'react';
import PropTypes from 'prop-types';
import {View, Keyboard} from 'react-native';

import Colors from '../Colors';

import {Button} from './Button';

type DisabledButtonProps = {
  text: string;
  accessibilityLabel?: string;
};

type EnabledButtonProps = DisabledButtonProps & {
  onSubmit: () => any;
  accessibilityHint?: string;
};

type SubmitButtonProps = EnabledButtonProps & {
  disabled: boolean;
};

const SubmitButton = ({
  text,
  onSubmit,
  disabled,
  accessibilityHint,
  accessibilityLabel,
}: SubmitButtonProps) => (
  <View style={{marginVertical: 25}}>
    {disabled ? (
      <DisabledSubmitButton
        text={text}
        accessibilityLabel={accessibilityLabel}
      />
    ) : (
      <EnabledSubmitButton
        onSubmit={() => {
          Keyboard.dismiss();
          onSubmit();
        }}
        text={text}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      />
    )}
  </View>
);

const DisabledSubmitButton = ({
  text,
  accessibilityLabel,
}: DisabledButtonProps) => {
  const style = {backgroundColor: 'white', textColor: Colors.FADED};
  return (
    <Button
      onPress={() => Keyboard.dismiss()}
      text={text}
      buttonStyle={style}
      pressedButtonStyle={style}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{disabled: true}}
    />
  );
};

const EnabledSubmitButton = ({
  text,
  onSubmit,
  accessibilityHint,
  accessibilityLabel,
}: EnabledButtonProps) => (
  <Button
    onPress={onSubmit}
    text={text}
    buttonStyle={{backgroundColor: Colors.VALID_GREEN, textColor: 'white'}}
    pressedButtonStyle={{
      backgroundColor: Colors.VALID_GREEN_DARK,
      textColor: 'white',
    }}
    accessibilityLabel={accessibilityLabel}
    accessibilityHint={accessibilityHint}
    accessibilityState={{disabled: false}}
  />
);

SubmitButton.propTypes = {
  text: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

SubmitButton.defaultProps = {
  disabled: false,
};

export default SubmitButton;
