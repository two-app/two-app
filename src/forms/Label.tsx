import React from 'react';
import {StyleSheet, Text} from 'react-native';
import PropTypes from 'prop-types';

import Colors from '../Colors';

const Label = ({text}: {text: string}) => (
  <Text style={styles.label}>{text}</Text>
);

Label.propTypes = {
  text: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  label: {
    marginTop: 20,
    fontSize: 12,
    color: Colors.DARK,
    fontWeight: 'bold',
  },
});

export default Label;
