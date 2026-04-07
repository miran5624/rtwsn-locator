export type AppRole = 'idle' | 'broadcaster' | 'relay' | 'listener';
export type RSSIState = 'hot' | 'warm' | 'cold';

export interface SOSPacket {
  userId: string;
  medicalTag?: string;
  timestamp: number;
}

export interface DetectedDevice {
  id: string;
  rssi: number;
  packet: SOSPacket;
  lastSeen: number;
}

export const getRSSIState = (rssi: number): RSSIState => {
  if (rssi >= -50) return 'hot';
  if (rssi >= -70) return 'warm';
  return 'cold';
};

export const RSSI_COLORS = {
  hot: '#00C853',
  warm: '#FFD600',
  cold: '#2979FF',
};
