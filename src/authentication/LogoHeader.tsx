import {StyleSheet, Text} from 'react-native';

import Colors from '../Colors';

export const LogoHeader = ({heading}: {heading: string}) => (
  <>
    <Text style={styles.logo}>two.</Text>
    <Text style={styles.heading}>{heading}</Text>
  </>
);

const styles = StyleSheet.create({
  logo: {
    color: Colors.SALMON,
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 25,
    fontWeight: '700',
    color: Colors.DARK,
    fontFamily: 'Montserrat-SemiBold',
  },
});
