import {StyleSheet, Text} from 'react-native';

import Colors from '../Colors';

export const Label = ({text}: {text: string}) => (
  <Text style={styles.label}>{text}</Text>
);

const styles = StyleSheet.create({
  label: {
    marginTop: 20,
    fontSize: 12,
    color: Colors.DARK,
    fontWeight: 'bold',
  },
});
