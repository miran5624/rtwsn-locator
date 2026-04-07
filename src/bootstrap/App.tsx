import React, { useState, useEffect } from 'react';
import { View, AppState, AppStateStatus } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';

import SplashScreen from './SplashScreen';
import RootNavigator from './RootNavigator';

// LOCKED IMPORTS
// @ts-ignore
import PermissionModal, { usePermissions } from '../permissions/PermissionModal';
// @ts-ignore
import { useForegroundService } from '../permissions/useForegroundService';
// @ts-ignore
import RelayEngine from '../relay/RelayEngine';

const FallbackRelayEngine = () => null;
const FallbackPermissionModal = () => null;

const SafeRelayEngine = RelayEngine || FallbackRelayEngine;
const SafePermissionModal = PermissionModal || FallbackPermissionModal;

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const { hasAll, requestAll } = usePermissions
    ? usePermissions()
    : { hasAll: true, requestAll: () => { } };

  const { startService } = useForegroundService
    ? useForegroundService()
    : { startService: () => { } };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      console.log('[App] state → ' + nextState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAcceptPermissions = () => {
    if (requestAll) requestAll();
    if (startService) startService();
    setShowModal(false);
  };

  const handleDismissPermissions = () => {
    setShowModal(false);
  };

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <SafeRelayEngine />
      {(!hasAll && showModal) && (
        <SafePermissionModal
          onAccept={handleAcceptPermissions}
          onDismiss={handleDismissPermissions}
        />
      )}
      <NavigationContainer
        theme={{
          ...DarkTheme, // Spreads default properties, including the missing 'fonts'
          colors: {
            ...DarkTheme.colors, // Keeps default colors for anything you don't explicitly override
            background: '#0A0A0A',
            card: '#0A0A0A',
            text: '#FFFFFF',
            border: '#1C1C1C',
            notification: '#E8001C',
            primary: '#E8001C',
          },
        }}
      >
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}
