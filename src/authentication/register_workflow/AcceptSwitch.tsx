import {StyleSheet, Switch, Text, View} from 'react-native';
import React, {useState} from 'react';

import Colors from '../../Colors';

type AcceptBoxProps = {
  children?: React.ReactNode;
  onEmit: (isChecked: boolean) => void;
  required?: boolean;
  accessibilityLabel: string;
};

const AcceptBox = ({
  children,
  onEmit,
  required,
  accessibilityLabel,
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
          accessibilityState={{checked: accepted}}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={
            required ? 'Acceptance is required.' : 'Acceptance is optional.'
          }
        />
      </View>
    </View>
  );
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
