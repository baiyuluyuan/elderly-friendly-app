import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, SHADOWS } from '../constants';

interface EmergencyButtonProps {
  title: string;
  onPress: () => void;
  fontSize?: keyof typeof FONT_SIZES;
  style?: ViewStyle;
  disabled?: boolean;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  title,
  onPress,
  fontSize = 'large',
  style,
  disabled = false,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: disabled ? COLORS.BORDER : COLORS.EMERGENCY,
          },
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.buttonText,
            {
              fontSize: FONT_SIZES[fontSize].button,
              color: disabled ? COLORS.TEXT_SECONDARY : COLORS.TEXT_ON_PRIMARY,
            },
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50, // 圆形按钮
    width: 120,
    height: 120,
    ...SHADOWS.large,
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EmergencyButton;
