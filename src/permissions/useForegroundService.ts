import { NativeModules } from 'react-native';

export const useForegroundService = () => {
    const startService = async (): Promise<void> => {
        if (!NativeModules.ForegroundService) {
            console.warn('ForegroundService module is not available');
            return;
        }
        try {
            await NativeModules.ForegroundService.startService();
        } catch (e) {
            console.warn('Failed to start foreground service', e);
        }
    };

    const stopService = async (): Promise<void> => {
        if (!NativeModules.ForegroundService) {
            console.warn('ForegroundService module is not available');
            return;
        }
        try {
            await NativeModules.ForegroundService.stopService();
        } catch (e) {
            console.warn('Failed to stop foreground service', e);
        }
    };

    const isRunning = async (): Promise<boolean> => {
        if (!NativeModules.ForegroundService) {
            console.warn('ForegroundService module is not available');
            return false;
        }
        try {
            return await NativeModules.ForegroundService.isRunning();
        } catch (e) {
            console.warn('Failed to check foreground service status', e);
            return false;
        }
    };

    return { startService, stopService, isRunning };
};
