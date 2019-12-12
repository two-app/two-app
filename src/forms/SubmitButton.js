import React from "react";
import PropTypes from "prop-types";
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import Colors from "../Colors";

const SubmitButton = ({text, onSubmit, disabled}) => (
    <TouchableOpacity style={[styles.submitButton, disabled ? styles.disabledSubmitButton : undefined]}
                      onPress={onSubmit}
                      disabled={disabled}>
        <Text style={styles.submitText}>{text}</Text>
    </TouchableOpacity>
);

SubmitButton.propTypes = {
    text: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

SubmitButton.defaultProps = {
    disabled: false
};

const styles = StyleSheet.create({
    submitButton: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.SALMON,
        padding: 20,
        marginTop: 25,
        marginBottom: 25
    },
    disabledSubmitButton: {
        backgroundColor: Colors.FADED
    },
    submitText: {
        color: "white",
        fontWeight: "bold"
    }
});

export default SubmitButton;