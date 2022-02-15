import {useState} from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableWithoutFeedbackProps,
  View,
  ViewStyle,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native';
import Colors from '../Colors';

type BaseButtonProps = TouchableWithoutFeedbackProps & {
  loading?: boolean;
  loadingColor?: string;
  viewStyle?: ViewStyle;
};

type StyledButtonProps = BaseButtonProps & {
  color: string;
  pressedColor: string;
};

type XButtonProps = BaseButtonProps & {
  children: string;
};

export const PrimaryButton = (props: XButtonProps) => (
  <StyledButton
    {...props}
    pressedColor={Colors.DARK_SALMON}
    color={Colors.SALMON}>
    <Text
      style={{
        color: 'white',
        fontWeight: '600',
        fontFamily: 'Montserrat-SemiBold',
      }}>
      {props.children}
    </Text>
  </StyledButton>
);

export const StyledButton = (props: StyledButtonProps) => {
  const [pressed, setPressed] = useState(false);
  return (
    <BaseButton
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      viewStyle={{
        height: 45,
        backgroundColor: pressed ? props.pressedColor : props.color,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      {...props}
    />
  );
};

export const BaseButton = (props: BaseButtonProps) => {
  const loadingColor = props.loadingColor ?? 'white';

  return (
    <View style={props.style}>
      <TouchableWithoutFeedback {...props}>
        <View style={[{flexDirection: 'row'}, props.viewStyle]}>
          {props.children}
          {props.loading && <ButtonLoadingIndicator color={loadingColor} />}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const ButtonLoadingIndicator = ({color}: {color: string}) => (
  <ActivityIndicator color={color} style={{marginLeft: 10}} size="small" />
);
