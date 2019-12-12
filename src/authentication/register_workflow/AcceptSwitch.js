import {StyleSheet, Switch, Text, View} from "react-native";
import PropTypes from "prop-types";
import Colors from "../../Colors";
import React, {useState} from "react";

const AcceptBox = ({children, onEmit}) => {
    const [accepted, setAccepted] = useState(false);
    return (
        <View style={styles.container}>
            <Text style={[styles.condition, accepted ? styles.acceptedCondition : undefined]}>{children}</Text>
            <View style={styles.switchContainer}>
                <Switch style={styles.switch}
                        value={accepted}
                        onValueChange={setAccepted}
                />
            </View>
        </View>
    );
};

AcceptBox.propTypes = {
    children: PropTypes.any,
    onEmit: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.LIGHT,
        borderRadius: 10,
        padding: 20,
        marginTop: 20
    },
    condition: {
        color: Colors.DARK,
        width: "80%"
    },
    acceptedCondition: {
        color: Colors.FADED
    },
    switchContainer: {
        width: "20%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    switch: {
        transform: [{scaleX: .8}, {scaleY: .8}]
    }
});

export default AcceptBox;