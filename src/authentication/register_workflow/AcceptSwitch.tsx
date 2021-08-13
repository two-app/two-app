import {StyleSheet, Switch, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

import Colors from '../../Colors';

type AcceptBoxProps = {
  children?: any;
  onEmit: any;
  required?: boolean;
  accessibilityHint: string;
};

const AcceptBox = ({
  children,
  onEmit,
  required,
  accessibilityHint,
}: AcceptBoxProps) => {
  const [accepted, setAccepted] = useState(false);

  return (
    <View
      style={[
        styles.container,
        required ? styles.required : undefined,
        accepted ? styles.accepted : undefined,
      ]}
      data-testid="container">
      <Text
        style={[styles.condition, accepted ? styles.acceptedText : undefined]}>
        {children}
      </Text>
      <View style={styles.switchContainer}>
        <Switch
          style={styles.switch}
          value={accepted}
          onValueChange={v => {
            setAccepted(v);
            onEmit(v);
          }}
          accessibilityHint={accessibilityHint}
        />
      </View>
    </View>
  );
};

AcceptBox.propTypes = {
  onEmit: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
};

AcceptBox.defaultProps = {
  isRequired: false,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: Colors.LIGHT,
    borderWidth: 1,
    padding: 20,
    marginTop: 20,
  },
  required: {
    borderColor: Colors.DARK,
  },
  accepted: {
    borderColor: Colors.VALID_GREEN_DARK,
    backgroundColor: Colors.VALID_GREEN,
  },
  acceptedText: {
    color: 'white',
  },
  condition: {
    color: Colors.DARK,
    width: '80%',
  },
  switchContainer: {
    width: '20%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switch: {
    transform: [{scaleX: 0.8}, {scaleY: 0.8}],
  },
});

export default AcceptBox;
