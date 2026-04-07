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
  userId: '',
  detectedDevices: [],
  isServiceRunning: false,
  setRole: (role) => set({ role }),
  setUserId: (userId) => set({ userId }),
  upsertDevice: (device) => set((s) => ({
    detectedDevices: [
      ...s.detectedDevices.filter((d) => d.id !== device.id),
      device,
    ],
  })),
  clearDevices: () => set({ detectedDevices: [] }),
  setServiceRunning: (isServiceRunning) => set({ isServiceRunning }),
}));
