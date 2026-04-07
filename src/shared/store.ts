import { create } from 'zustand';
import { AppRole, DetectedDevice } from './types';

interface AppState {
  role: AppRole;
  userId: string;
  detectedDevices: DetectedDevice[];
  isServiceRunning: boolean;
  setRole: (role: AppRole) => void;
  setUserId: (id: string) => void;
  upsertDevice: (device: DetectedDevice) => void;
  clearDevices: () => void;
  setServiceRunning: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: 'idle',
  userId: `USER-${Math.random().toString(36).substring(2, 11)}`,
  detectedDevices: [],
  isServiceRunning: false,
  setRole: (role) => set({ role }),
  setUserId: (userId) => set({ userId }),
  upsertDevice: (device) =>
    set((state) => {
      const index = state.detectedDevices.findIndex((d) => d.id === device.id);
      if (index > -1) {
        const newDevices = [...state.detectedDevices];
        newDevices[index] = device;
        return { detectedDevices: newDevices };
      }
      return { detectedDevices: [...state.detectedDevices, device] };
    }),
  clearDevices: () => set({ detectedDevices: [] }),
  setServiceRunning: (isServiceRunning) => set({ isServiceRunning }),
}));
