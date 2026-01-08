// app/settings/types.ts
export interface Settings {
    general: GeneralSettings;
    notifications: NotificationSettings;
    parking: ParkingSettings;
    privacy: PrivacySettings;
    app: AppSettings;
  }
  
  export interface GeneralSettings {
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    currency: string;
    theme: string;
  }
  
  export interface NotificationSettings {
    email: EmailNotifications;
    push: PushNotifications;
    sms: SmsNotifications;
    sound: SoundSettings;
  }
  
  export interface EmailNotifications {
    bookingConfirmations: boolean;
    bookingReminders: boolean;
    securityAlerts: boolean;
    systemUpdates: boolean;
    promotions: boolean;
  }
  
  export interface PushNotifications {
    bookingStatus: boolean;
    gateAccess: boolean;
    securityAlerts: boolean;
    parkingAvailability: boolean;
  }
  
  export interface SmsNotifications {
    emergencyAlerts: boolean;
    gateAccessCodes: boolean;
    bookingReminders: boolean;
  }
  
  export interface SoundSettings {
    bookingConfirmation: boolean;
    gateAccess: boolean;
    securityAlert: boolean;
  }
  
  export interface ParkingSettings {
    defaultVehicle: string;
    defaultLocation: string;
    defaultDuration: string;
    autoExtend: boolean;
    autoExtendThreshold: string;
    quickBookEnabled: boolean;
    showParkingTips: boolean;
    mapType: string;
    showRealTimeAvailability: boolean;
  }
  
  export interface PrivacySettings {
    showProfileToOthers: boolean;
    showVehicleInfo: boolean;
    shareParkingHistory: boolean;
    autoLogout: boolean;
    autoLogoutTime: string;
    twoFactorAuth: boolean;
    saveLoginCredentials: boolean;
    biometricLogin: boolean;
  }
  
  export interface AppSettings {
    dataSaver: boolean;
    autoUpdate: boolean;
    backgroundRefresh: boolean;
    cacheDuration: string;
    vibrationFeedback: boolean;
    hapticFeedback: boolean;
    animationSpeed: string;
  }
  
  export interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  
  export interface SettingsProps {
    settings: Settings;
    onUpdateSetting: (category: keyof Settings, key: string, value: any) => void;
    onUpdateNestedSetting: (category: keyof Settings, subcategory: string, key: string, value: any) => void;
    onToggleSetting: (category: keyof Settings, subcategory: string, key: string) => void;
    loading?: boolean;
  }