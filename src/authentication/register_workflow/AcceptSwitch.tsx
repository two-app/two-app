import {StyleSheet, Switch, Text, View} from 'react-native';
import React, {useState} from 'react';

import Colors from '../../Colors';

type AcceptBoxProps = {
  children?: React.ReactNode;
  onEmit: (isChecked: boolean) => void;
  required?: boolean;
  accessibilityLabel: string;
};

export const AcceptSwitch = ({
  children,
  onEmit,
  required,
  accessibilityLabel,
}: AcceptBoxProps) => {
  const [checked, setChecked] = useState(false);

  const check = (isChecked: boolean) => {
    setChecked(isChecked);
    onEmit(isChecked);
  };

  return (
    <View
      style={[
        styles.container,
        required ? styles.required : undefined,
        checked ? styles.accepted : undefined,
      ]}>
      <Text
        style={[styles.condition, checked ? styles.acceptedText : undefined]}>
        {children}
      </Text>
      <View style={styles.switchContainer}>
        <Switch
          style={styles.switch}
          value={checked}
          onValueChange={check}
          accessibilityState={{checked: checked}}
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
