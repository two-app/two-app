import {View} from 'react-native';
import Colors from '../Colors';
import React from 'react';

export const InputCard = ({children, style}: { children?: any, style?: any }) => <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderColor: Colors.FADED,
    borderWidth: 0.5,
    borderRadius: 5,
    shadowColor: Colors.DARK,
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 3,
    marginLeft: 3, // Margins used since the card is usually clipped horizontally
    marginRight: 3, // So margin is equal to the radius on either side
    elevation: 3,
    ...style
}}>
    {children}
</View>;