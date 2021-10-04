import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
} from 'react-native';

import Colors from '../Colors';

type LoadingViewProps = {
  loadingPercentage?: number;
};

const LoadingView = ({loadingPercentage}: LoadingViewProps) => (
  <View
    style={{
      ...styles.overlay,
      height: useWindowDimensions().height,
      width: useWindowDimensions().width,
    }}
    accessibilityState={{busy: true}}
    accessibilityHint="Waiting for an action to finish...">
    {loadingPercentage != null && (
      <Text style={styles.percentage}>{loadingPercentage}%</Text>
    )}
    <ActivityIndicator
      size="small"
      color="black"
      style={styles.overlayIndicator}
    />
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute',
    opacity: 0.5,
    backgroundColor: 'white',
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayIndicator: {
    zIndex: 3,
  },
  percentage: {
    color: Colors.DARK,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default LoadingView;
