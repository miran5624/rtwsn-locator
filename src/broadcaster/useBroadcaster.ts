import { useState, useEffect, useCallback } from 'react';
import { NativeModules, Vibration } from 'react-native';
import { SOS_SERVICE_UUID } from '../shared/bleConstants';
import { useAppStore } from '../shared/store';

export const useBroadcaster = () => {
  const [isAdvertising, setIsAdvertising] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setRole, setUserId } = useAppStore();

  const stopSOS = useCallback(async (): Promise<void> => {
    try {
      if (NativeModules.BLEAdvertiser) {
        await NativeModules.BLEAdvertiser.stopAdvertising();
      }
    } catch (e: any) {
      console.warn('Failed to stop advertising in native module', e);
    } finally {
      setIsAdvertising(false);
      setRole('idle');
    }
  }, [setRole]);

  const startSOS = useCallback(async (userId: string, medicalTag?: string): Promise<void> => {
    setError(null);
    
    if (!NativeModules.BLEAdvertiser) {
      setError('Native BLE module unavailable');
      return;
    }

    try {
      const payload = JSON.stringify({
        userId,
        medicalTag: medicalTag ?? '',
        timestamp: Date.now()
      });

      await NativeModules.BLEAdvertiser.startAdvertising(SOS_SERVICE_UUID, payload);
      
      setIsAdvertising(true);
      setRole('broadcaster');
      setUserId(userId);
      Vibration.vibrate([0, 200, 100, 200]);
    } catch (e: any) {
      setError(e.message || 'Unknown error occurred while starting SOS');
    }
  }, [setRole, setUserId]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopSOS();
    };
  }, [stopSOS]);

  return {
    isAdvertising,
    error,
    startSOS,
    stopSOS
  };
};
