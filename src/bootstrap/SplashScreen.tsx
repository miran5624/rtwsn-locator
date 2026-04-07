import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 2200);

    return () => clearTimeout(timer);
  }, [fadeAnim, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.logoContainer}>
          <View style={styles.outerSquare} />
          <View style={styles.innerSquare} />
        </View>
        <Text style={styles.title}>PORTABLE ANCHORS</Text>
        <Text style={styles.subtitle}>Offline Safety Mesh</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerSquare: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderWidth: 2,
    borderColor: 'white',
  },
  innerSquare: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: '#E8001C',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 6,
    marginTop: 24,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    letterSpacing: 2,
    marginTop: 6,
  },
});
