import React from 'react';
import {Text, TextStyle} from 'react-native';

import Colors from '../Colors';

const Heading = ({children, style}: {children: string; style?: TextStyle}) => (
  <Text
    style={{
      color: Colors.VERY_DARK,
      fontSize: 35,
      fontFamily: 'Montserrat-ExtraBold',
      marginTop: 20,
      ...style,
    }}
  >
    {children}
  </Text>
);

export {Heading};
