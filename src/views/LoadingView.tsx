import {ActivityIndicator, Dimensions, StyleSheet, View} from "react-native";
import Colors from "../Colors";
import React from "react";

const LoadingView = () => <View style={styles.overlay}>
    <ActivityIndicator size="small" color="black" style={styles.overlayIndicator}/>
</View>;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: "absolute",
        opacity: 0.5,
        backgroundColor: 'white',
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        zIndex: 2,
        alignItems: "center",
        justifyContent: "center"
    },
    overlayIndicator: {
        zIndex: 3
    },
    error: {
        color: Colors.DARK_SALMON
    }
});

export default LoadingView;