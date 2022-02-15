import {View} from 'react-native';

export const HR = ({margin}: {margin?: number}) => (
  <View
    style={{
      width: '100%',
      height: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      marginVertical: margin ?? 20,
    }}
  />
);
