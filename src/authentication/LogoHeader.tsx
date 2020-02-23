import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Colors from '../Colors';

const LogoHeader = ({heading}: { heading: string }) => (
    <>
        <Text style={styles.logo}>two.</Text>
        <Text style={styles.heading} id="heading">{heading}</Text>
    </>
);

const styles = StyleSheet.create({
    logo: {
        color: Colors.SALMON,
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 20,
        paddingBottom: 20
    },
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        color: Colors.DARK
    }
});

export default LogoHeader;