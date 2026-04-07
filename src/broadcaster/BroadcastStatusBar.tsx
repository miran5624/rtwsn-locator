import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const BroadcastStatusBar = () => {
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacityAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.col}>
        <Text style={styles.label}>STATUS</Text>
        <Text style={[styles.val, styles.valLive]}>LIVE</Text>
      </View>

      <View style={styles.col}>
        <Text style={styles.label}>SIGNAL</Text>
        <Text style={styles.val}>BLE 5.0</Text>
      </View>

      <View style={styles.col}>
        <Text style={styles.label}>RANGE</Text>
        <Text style={styles.val}>~30m</Text>
      </View>

      <Animated.View style={[styles.breathingBar, { opacity: opacityAnim }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 24,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    letterSpacing: 2,
    color: '#666',
  },
  val: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
    color: '#ffffff',
  },
  valLive: {
    fontWeight: '800',
    color: '#00C853',
  },
  breathingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#E8001C',
  },
});

export default BroadcastStatusBar;
