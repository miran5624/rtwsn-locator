import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, StyleSheet } from 'react-native';

interface SOSButtonProps {
  isActive: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const SOSButton: React.FC<SOSButtonProps> = ({ isActive, onPress, disabled = false }) => {
  const anim1Scale = useRef(new Animated.Value(1)).current;
  const anim1Opacity = useRef(new Animated.Value(0.6)).current;
  const anim2Scale = useRef(new Animated.Value(1)).current;
  const anim2Opacity = useRef(new Animated.Value(0.6)).current;
  const anim3Scale = useRef(new Animated.Value(1)).current;
  const anim3Opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    let loops: Animated.CompositeAnimation[] = [];

    const createRipple = (scaleAnim: Animated.Value, opacityAnim: Animated.Value, delay: number) => {
      // Create a sequence that starts with a delay, animates, and instantly resets
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 2.2,
              duration: 1800,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 1800,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0.6, duration: 0, useNativeDriver: true }),
          ]),
        ])
      );
    };

    if (isActive && !disabled) {
      loops = [
        createRipple(anim1Scale, anim1Opacity, 0),
        createRipple(anim2Scale, anim2Opacity, 600),
        createRipple(anim3Scale, anim3Opacity, 1200),
      ];
      loops.forEach((loop) => loop.start());
    } else {
      loops.forEach((loop) => loop.stop());
      anim1Scale.setValue(1);
      anim1Opacity.setValue(0.6);
      anim2Scale.setValue(1);
      anim2Opacity.setValue(0.6);
      anim3Scale.setValue(1);
      anim3Opacity.setValue(0.6);
    }

    return () => {
      loops.forEach((loop) => loop.stop());
    };
  }, [isActive, disabled, anim1Scale, anim1Opacity, anim2Scale, anim2Opacity, anim3Scale, anim3Opacity]);

  return (
    <View style={styles.container}>
      {isActive && !disabled && (
        <>
          <Animated.View
            style={[styles.ripple, { transform: [{ scale: anim1Scale }], opacity: anim1Opacity }]}
          />
          <Animated.View
            style={[styles.ripple, { transform: [{ scale: anim2Scale }], opacity: anim2Opacity }]}
          />
          <Animated.View
            style={[styles.ripple, { transform: [{ scale: anim3Scale }], opacity: anim3Opacity }]}
          />
        </>
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled}
        style={[styles.button, disabled && styles.buttonDisabled]}
      >
        {isActive ? (
          <Text style={styles.textActive}>ACTIVE</Text>
        ) : (
          <Text style={styles.textIdle}>SOS</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#E8001C',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  ripple: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: '#E8001C',
    zIndex: 1,
  },
  textIdle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 4,
  },
  textActive: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 6,
  },
});

export default SOSButton;
