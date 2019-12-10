// @flow
import React, {useState} from "react";
import PropTypes from "prop-types";
import {StyleSheet, TextInput} from "react-native";
import Colors from "../Colors";
import Label from "./Label";

/**
 * @callback isValidFn
 * @param {string} text in the input.
 * @returns {boolean} true if the input is valid.
 */

/**
 * Emit is called when the user deselects the input.
 * @callback onEmitFn
 * @param {string} the last valid value in the input.
 */

/**
 * @param {Object} attributes to apply on the input, e.g {placeholder: "email"}
 * @param {isValidFn} isValid callback to check if the input text is valid.
 * @param {onEmitFn} onEmit callback when the user deselects the input.
 * @param {string} label to display with the input.
 * @returns {*} the Input component.
 */
const Input = ({attributes, isValid, onEmit, label}) => {
    const [value, setValue] = useState("");
    const [valid, setValid] = useState(true);
    const [focused, setFocused] = useState(false);

    const input = (
        <TextInput
            {...attributes}
            value={value}
            onChangeText={setValue}
            onBlur={() => {
                setFocused(false);
                const isValueValid = isValid(value);
                setValid(isValueValid);
                if (isValueValid) onEmit(value);
            }}
            onFocus={() => setFocused(true)}
            style={[
                styles.input,
                focused ? styles.focusedInput : undefined,
                valid ? undefined : styles.invalidInput
            ]}
        />
    );

    if (label == null) {
        return input;
    } else {
        return (
            <>
                <Label text={label} style={styles.label}/>
                {input}
            </>
        );
    }
};

Input.propTypes = {
    attributes: PropTypes.object,
    isValid: PropTypes.func,
    onEmit: PropTypes.func,
    label: PropTypes.string
};

Input.defaultProps = {
    attributes: {},
    isValid: () => true,
    onEmit: () => {
    }
};

const styles = StyleSheet.create({
    input: {
        width: '100%',
        borderBottomColor: Colors.FADED,
        borderBottomWidth: 1,
        paddingHorizontal: 0,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 15
    },
    focusedInput: {
        borderBottomColor: Colors.DARK
    },
    invalidInput: {
        borderBottomColor: Colors.SALMON,
        color: Colors.SALMON
    },
    label: {
        marginTop: 10,
        marginBottom: 10
    }
});

export default Input;