import React from "react";
import PropTypes from "prop-types";
import { View, Keyboard } from "react-native";
import Colors from "../Colors";
import { Button } from "./Button";

type DisabledButtonProps = {
    text: string
};

type EnabledButtonProps = DisabledButtonProps & {
    onSubmit: () => any
};

type SubmitButtonProps = EnabledButtonProps & {
    disabled: boolean
};

const SubmitButton = ({ text, onSubmit, disabled }: SubmitButtonProps) => (
    <View style={{ marginVertical: 25 }}>
        {disabled ?
            <DisabledSubmitButton text={text}/>
            :
            <EnabledSubmitButton onSubmit={() => {
                console.log("dismissing")
                Keyboard.dismiss();
                onSubmit();
            }} text={text} />
        }
    </View>
);

const DisabledSubmitButton = ({ text }: DisabledButtonProps) => (
    <Button onPress={() => Keyboard.dismiss()} text={text}
        buttonStyle={{ backgroundColor: 'white', textColor: Colors.REGULAR }}
        pressedButtonStyle={{ backgroundColor: '#fafafa', textColor: Colors.REGULAR }}
    />
);

const EnabledSubmitButton = ({ text, onSubmit }: EnabledButtonProps) => (
    <Button onPress={onSubmit} text={text}
        buttonStyle={{ backgroundColor: Colors.VALID_GREEN, textColor: 'white' }}
        pressedButtonStyle={{ backgroundColor: Colors.VALID_GREEN_DARK, textColor: 'white' }}
    />
);

SubmitButton.propTypes = {
    text: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

SubmitButton.defaultProps = {
    disabled: false
};

export default SubmitButton;