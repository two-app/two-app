// @flow
import React, {useState} from "react";
import PropTypes from "prop-types";
import {StyleSheet, TextInput} from "react-native";
import Colors from "../Colors";

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
 * @returns {*} the Input component.
 */
const Input = ({attributes, isValid, onEmit}) => {
    const [value, setValue] = useState("");
    const [valid, setValid] = useState(true);

    return <TextInput
        {...attributes}
        onChangeText={setValue}
        onBlur={() => {
            const isValueValid = isValid(value);
            setValid(isValueValid);
            if (isValueValid) onEmit(value);
        }}
        style={[styles.input]}
    />;
};

Input.propTypes = {
    attributes: PropTypes.object,
    isValid: PropTypes.func,
    onEmit: PropTypes.func
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
    }
});

export default Input;