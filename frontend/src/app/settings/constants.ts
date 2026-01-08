// app/settings/constants.ts
import { Settings } from './types';

export const DEFAULT_SETTINGS: Settings = {
  general: {
    language: 'id',
    timezone: 'Asia/Jakarta',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'IDR',
    theme: 'light'
  },
  notifications: {
    email: {
      bookingConfirmations: true,
      bookingReminders: true,
      securityAlerts: true,
      systemUpdates: false,
      promotions: false
    },
    push: {
      bookingStatus: true,
      gateAccess: true,
      securityAlerts: true,
      parkingAvailability: false
    },
    sms: {
      emergencyAlerts: true,
      gateAccessCodes: false,
      bookingReminders: false
    },
    sound: {
      bookingConfirmation: true,
      gateAccess: true,
      securityAlert: true
    }
  },
  parking: {
    defaultVehicle: 'none',
    defaultLocation: 'none',
    defaultDuration: '4',
    autoExtend: false,
    autoExtendThreshold: '15',
    quickBookEnabled: true,
    showParkingTips: true,
    mapType: 'standard',
    showRealTimeAvailability: true
  },
  privacy: {
    showProfileToOthers: false,
    showVehicleInfo: false,
    shareParkingHistory: false,
    autoLogout: true,
    autoLogoutTime: '30',
    twoFactorAuth: false,
    saveLoginCredentials: true,
    biometricLogin: false
  },
  app: {
    dataSaver: false,
    autoUpdate: true,
    backgroundRefresh: true,
    cacheDuration: '7',
    vibrationFeedback: true,
    hapticFeedback: true,
    animationSpeed: 'normal'
  }
};