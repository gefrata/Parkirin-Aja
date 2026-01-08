'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import {
  Settings,
  Bell,
  Smartphone,
  Globe,
  Moon,
  Shield,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Download,
  Upload,
  Key,
  Trash2,
  User,
  Car,
  MapPin,
  Clock,
  QrCode,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Languages,
  Volume2,
  Wifi,
  Battery,
  Smartphone as Mobile,
  Mail,
  MessageSquare,
  Lock,
  Unlock,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    general: {
      language: 'id',
      timezone: 'Asia/Jakarta',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      currency: 'IDR',
      theme: 'light'
    },
    
    // Notification Settings
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
    
    // Parking Preferences
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
    
    // Privacy & Security
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
    
    // App Preferences
    app: {
      dataSaver: false,
      autoUpdate: true,
      backgroundRefresh: true,
      cacheDuration: '7',
      vibrationFeedback: true,
      hapticFeedback: true,
      animationSpeed: 'normal'
    }
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize with user data
  useEffect(() => {
    if (user) {
      // Simulate loading saved settings
      const savedSettings = localStorage.getItem('parking_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    }
  }, [user]);

  // Save settings
  const saveSettings = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Save to localStorage
      localStorage.setItem('parking_settings', JSON.stringify(settings));
      
      toast.success('Settings saved successfully!', {
        description: 'Your preferences have been updated.',
        duration: 3000
      });
      
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  // Reset settings
  const resetSettings = () => {
    toast('Reset all settings to default?', {
      description: 'This action cannot be undone.',
      duration: 5000,
      action: {
        label: 'Reset',
        onClick: () => {
          const defaultSettings = {
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
          
          setSettings(defaultSettings);
          localStorage.setItem('parking_settings', JSON.stringify(defaultSettings));
          toast.success('Settings reset to default values');
        }
      }
    });
  };

  // Update password
  const updatePassword = async () => {
    if (!passwordData.currentPassword) {
      toast.error('Please enter current password');
      return;
    }

    if (!passwordData.newPassword) {
      toast.error('Please enter new password');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password updated successfully!', {
        description: 'Your password has been changed.',
        duration: 3000
      });
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  // Export settings
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `polibatam-parking-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Settings exported successfully!');
  };

  // Import settings
  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings(importedSettings);
        toast.success('Settings imported successfully!');
      } catch (error) {
        toast.error('Invalid settings file');
      }
    };
    reader.readAsText(file);
    
    // Clear file input
    event.target.value = '';
  };

  // Toggle setting
  const toggleSetting = (category: keyof typeof settings, subcategory: string, key: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: {
          ...(prev[category] as any)[subcategory],
          [key]: !(prev[category] as any)[subcategory][key]
        }
      }
    }));
  };

  // Update setting value
  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  // Update nested setting value
  const updateNestedSetting = (category: keyof typeof settings, subcategory: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: {
          ...(prev[category] as any)[subcategory],
          [key]: value
        }
      }
    }));
  };

  // Get user's vehicles (mock data)
  const userVehicles = [
    { id: '1', plate: 'B 1234 XYZ', name: 'Toyota Camry', isDefault: true },
    { id: '2', plate: 'B 5678 ABC', name: 'Honda Motor', isDefault: false },
  ];

  // Get parking locations (mock data)
  const parkingLocations = [
    { id: '1', name: 'Main Gate Parking', type: 'motor' },
    { id: '2', name: 'Library Parking', type: 'motor' },
    { id: '3', name: 'Student Center Parking', type: 'car' },
    { id: '4', name: 'Workshop Area', type: 'motor' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
                  Dashboard
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm font-medium text-gray-700">Settings</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Settings className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">
                  Customize your Polibatam Parking System experience
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={resetSettings}
              >
                <RotateCcw className="h-4 w-4" />
                Reset All
              </Button>
              <Button 
                className="gap-2"
                onClick={saveSettings}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Settings Categories */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
                  <TabsTrigger value="general" className="gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">General</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="hidden sm:inline">Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="parking" className="gap-2">
                    <Car className="h-4 w-4" />
                    <span className="hidden sm:inline">Parking</span>
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Privacy</span>
                  </TabsTrigger>
                  <TabsTrigger value="app" className="gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span className="hidden sm:inline">App</span>
                  </TabsTrigger>
                </TabsList>

                {/* General Settings Tab */}
                <TabsContent value="general" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>General Settings</CardTitle>
                      <CardDescription>
                        Configure your basic preferences and display options
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <Select 
                            value={settings.general.language}
                            onValueChange={(value) => updateSetting('general', 'language', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                      a        <SelectItem value="id">
                                <div className="flex items-center gap-2">
                                  <span>🇮🇩</span>
                                  <span>Bahasa Indonesia</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="en">
                                <div className="flex items-center gap-2">
                                  <span>🇺🇸</span>
                                  <span>English</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select 
                            value={settings.general.timezone}
                            onValueChange={(value) => updateSetting('general', 'timezone', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                              <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                              <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="dateFormat">Date Format</Label>
                          <Select 
                            value={settings.general.dateFormat}
                            onValueChange={(value) => updateSetting('general', 'dateFormat', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select date format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</SelectItem>
                              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</SelectItem>
                              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="timeFormat">Time Format</Label>
                          <Select 
                            value={settings.general.timeFormat}
                            onValueChange={(value) => updateSetting('general', 'timeFormat', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select time format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="24h">24-hour (14:30)</SelectItem>
                              <SelectItem value="12h">12-hour (2:30 PM)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <div className="grid grid-cols-3 gap-4">
                          <Button
                            type="button"
                            variant={settings.general.theme === 'light' ? 'default' : 'outline'}
                            className="flex-col h-auto py-4"
                            onClick={() => updateSetting('general', 'theme', 'light')}
                          >
                            <div className="w-8 h-8 rounded-full bg-yellow-100 border-2 border-yellow-300 mb-2 flex items-center justify-center">
                              <span className="text-lg">☀️</span>
                            </div>
                            <span className="text-sm">Light</span>
                          </Button>
                          
                          <Button
                            type="button"
                            variant={settings.general.theme === 'dark' ? 'default' : 'outline'}
                            className="flex-col h-auto py-4"
                            onClick={() => updateSetting('general', 'theme', 'dark')}
                          >
                            <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-600 mb-2 flex items-center justify-center">
                              <span className="text-lg">🌙</span>
                            </div>
                            <span className="text-sm">Dark</span>
                          </Button>
                          
                          <Button
                            type="button"
                            variant={settings.general.theme === 'auto' ? 'default' : 'outline'}
                            className="flex-col h-auto py-4"
                            onClick={() => updateSetting('general', 'theme', 'auto')}
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-100 to-gray-800 border-2 border-gray-300 mb-2 flex items-center justify-center">
                              <span className="text-lg">🔄</span>
                            </div>
                            <span className="text-sm">Auto</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notifications Settings Tab */}
                <TabsContent value="notifications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>
                        Control how and when you receive notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Email Notifications */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold">Email Notifications</h3>
                        </div>
                        
                        <div className="space-y-4">
                          {Object.entries(settings.notifications.email).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-sm capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </Label>
                                <p className="text-xs text-gray-500">
                                  {key === 'bookingConfirmations' && 'Receive email when booking is confirmed'}
                                  {key === 'bookingReminders' && 'Get reminder before booking starts'}
                                  {key === 'securityAlerts' && 'Important security updates'}
                                  {key === 'systemUpdates' && 'System maintenance and updates'}
                                  {key === 'promotions' && 'Special offers and promotions'}
                                </p>
                              </div>
                              <Switch
                                checked={value}
                                onCheckedChange={() => toggleSetting('notifications', 'email', key)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Push Notifications */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-green-600" />
                          <h3 className="font-semibold">Push Notifications</h3>
                        </div>
                        
                        <div className="space-y-4">
                          {Object.entries(settings.notifications.push).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-sm capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </Label>
                                <p className="text-xs text-gray-500">
                                  {key === 'bookingStatus' && 'Real-time booking status updates'}
                                  {key === 'gateAccess' && 'Notifications when at parking gate'}
                                  {key === 'securityAlerts' && 'Immediate security alerts'}
                                  {key === 'parkingAvailability' && 'Parking slot availability updates'}
                                </p>
                              </div>
                              <Switch
                                checked={value}
                                onCheckedChange={() => toggleSetting('notifications', 'push', key)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* SMS Notifications */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-purple-600" />
                          <h3 className="font-semibold">SMS Notifications</h3>
                          <Badge variant="outline" className="text-xs">
                            Emergency Only
                          </Badge>
                        </div>
                        
                        <div className="space-y-4">
                          {Object.entries(settings.notifications.sms).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-sm capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </Label>
                                <p className="text-xs text-gray-500">
                                  {key === 'emergencyAlerts' && 'Critical emergency notifications'}
                                  {key === 'gateAccessCodes' && 'SMS gate access codes'}
                                  {key === 'bookingReminders' && 'SMS booking reminders'}
                                </p>
                              </div>
                              <Switch
                                checked={value}
                                onCheckedChange={() => toggleSetting('notifications', 'sms', key)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Sound Settings */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-5 w-5 text-amber-600" />
                          <h3 className="font-semibold">Sound & Vibration</h3>
                        </div>
                        
                        <div className="space-y-4">
                          {Object.entries(settings.notifications.sound).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-sm capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </Label>
                                <p className="text-xs text-gray-500">
                                  {key === 'bookingConfirmation' && 'Sound when booking confirmed'}
                                  {key === 'gateAccess' && 'Sound for gate access success/failure'}
                                  {key === 'securityAlert' && 'Distinct sound for security alerts'}
                                </p>
                              </div>
                              <Switch
                                checked={value}
                                onCheckedChange={() => toggleSetting('notifications', 'sound', key)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Parking Settings Tab */}
                <TabsContent value="parking" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Parking Preferences</CardTitle>
                      <CardDescription>
                        Customize your parking booking experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Default Vehicle */}
                      <div className="space-y-2">
                        <Label htmlFor="defaultVehicle">Default Vehicle</Label>
                        <Select 
                          value={settings.parking.defaultVehicle}
                          onValueChange={(value) => updateSetting('parking', 'defaultVehicle', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select default vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None (Ask each time)</SelectItem>
                            {userVehicles.map((vehicle) => (
                              <SelectItem key={vehicle.id} value={vehicle.id}>
                                <div className="flex items-center gap-2">
                                  <Car className="h-4 w-4" />
                                  <span>{vehicle.plate} - {vehicle.name}</span>
                                  {vehicle.isDefault && (
                                    <Badge variant="outline" className="text-xs ml-auto">
                                      Current
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Vehicle to use for quick bookings
                        </p>
                      </div>
                      
                      {/* Default Location */}
                      <div className="space-y-2">
                        <Label htmlFor="defaultLocation">Default Parking Location</Label>
                        <Select 
                          value={settings.parking.defaultLocation}
                          onValueChange={(value) => updateSetting('parking', 'defaultLocation', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select default location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None (Show map)</SelectItem>
                            {parkingLocations.map((location) => (
                              <SelectItem key={location.id} value={location.id}>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{location.name}</span>
                                  <Badge variant="outline" className="text-xs ml-auto">
                                    {location.type}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Preferred parking location for quick access
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Default Duration */}
                        <div className="space-y-2">
                          <Label htmlFor="defaultDuration">Default Booking Duration</Label>
                          <Select 
                            value={settings.parking.defaultDuration}
                            onValueChange={(value) => updateSetting('parking', 'defaultDuration', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2 hours</SelectItem>
                              <SelectItem value="4">4 hours</SelectItem>
                              <SelectItem value="8">8 hours (Full day)</SelectItem>
                              <SelectItem value="12">12 hours</SelectItem>
                              <SelectItem value="custom">Custom (Ask each time)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Map Type */}
                        <div className="space-y-2">
                          <Label htmlFor="mapType">Map Display Type</Label>
                          <Select 
                            value={settings.parking.mapType}
                            onValueChange={(value) => updateSetting('parking', 'mapType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select map type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard Map</SelectItem>
                              <SelectItem value="satellite">Satellite View</SelectItem>
                              <SelectItem value="hybrid">Hybrid View</SelectItem>
                              <SelectItem value="terrain">Terrain View</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Auto-extend Settings */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Auto-extend Booking</Label>
                            <p className="text-sm text-gray-500">
                              Automatically extend booking when near expiration
                            </p>
                          </div>
                          <Switch
                            checked={settings.parking.autoExtend}
                            onCheckedChange={(checked) => updateSetting('parking', 'autoExtend', checked)}
                          />
                        </div>
                        
                        {settings.parking.autoExtend && (
                          <div className="space-y-2 pl-6">
                            <Label htmlFor="autoExtendThreshold">
                              Extend when <span className="font-medium">{settings.parking.autoExtendThreshold}</span> minutes remaining
                            </Label>
                            <div className="flex items-center gap-4">
                              <span className="text-sm">15 min</span>
                              <input
                                type="range"
                                min="5"
                                max="60"
                                step="5"
                                value={settings.parking.autoExtendThreshold}
                                onChange={(e) => updateSetting('parking', 'autoExtendThreshold', e.target.value)}
                                className="flex-1"
                              />
                              <span className="text-sm">60 min</span>
                            </div>
                            <p className="text-xs text-gray-500">
                              You will be notified before auto-extension
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <Separator />
                      
                      {/* Other Preferences */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Quick Book Feature</Label>
                            <p className="text-xs text-gray-500">
                              Enable one-tap booking for frequent locations
                            </p>
                          </div>
                          <Switch
                            checked={settings.parking.quickBookEnabled}
                            onCheckedChange={(checked) => updateSetting('parking', 'quickBookEnabled', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Show Parking Tips</Label>
                            <p className="text-xs text-gray-500">
                              Show helpful tips and suggestions
                            </p>
                          </div>
                          <Switch
                            checked={settings.parking.showParkingTips}
                            onCheckedChange={(checked) => updateSetting('parking', 'showParkingTips', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Real-time Availability</Label>
                            <p className="text-xs text-gray-500">
                              Show live parking slot availability
                            </p>
                          </div>
                          <Switch
                            checked={settings.parking.showRealTimeAvailability}
                            onCheckedChange={(checked) => updateSetting('parking', 'showRealTimeAvailability', checked)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Privacy & Security Tab */}
                <TabsContent value="privacy" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy & Security</CardTitle>
                      <CardDescription>
                        Manage your privacy settings and security preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Privacy Settings */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Privacy Settings</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Show Profile to Others</Label>
                              <p className="text-xs text-gray-500">
                                Allow other users to see your basic profile
                              </p>
                            </div>
                            <Switch
                              checked={settings.privacy.showProfileToOthers}
                              onCheckedChange={(checked) => updateSetting('privacy', 'showProfileToOthers', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Show Vehicle Information</Label>
                              <p className="text-xs text-gray-500">
                                Allow others to see your vehicle details
                              </p>
                            </div>
                            <Switch
                              checked={settings.privacy.showVehicleInfo}
                              onCheckedChange={(checked) => updateSetting('privacy', 'showVehicleInfo', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Share Parking History</Label>
                              <p className="text-xs text-gray-500">
                                Anonymized parking data for system improvement
                              </p>
                            </div>
                            <Switch
                              checked={settings.privacy.shareParkingHistory}
                              onCheckedChange={(checked) => updateSetting('privacy', 'shareParkingHistory', checked)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Security Settings */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Security Settings</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Auto Logout</Label>
                              <p className="text-xs text-gray-500">
                                Automatically logout after period of inactivity
                              </p>
                            </div>
                            <Switch
                              checked={settings.privacy.autoLogout}
                              onCheckedChange={(checked) => updateSetting('privacy', 'autoLogout', checked)}
                            />
                          </div>
                          
                          {settings.privacy.autoLogout && (
                            <div className="space-y-2 pl-6">
                              <Label htmlFor="autoLogoutTime">
                                Logout after <span className="font-medium">{settings.privacy.autoLogoutTime}</span> minutes
                              </Label>
                              <div className="flex items-center gap-4">
                                <span className="text-sm">5 min</span>
                                <input
                                  type="range"
                                  min="5"
                                  max="120"
                                  step="5"
                                  value={settings.privacy.autoLogoutTime}
                                  onChange={(e) => updateSetting('privacy', 'autoLogoutTime', e.target.value)}
                                  className="flex-1"
                                />
                                <span className="text-sm">120 min</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Two-Factor Authentication</Label>
                              <p className="text-xs text-gray-500">
                                Add extra security layer to your account
                              </p>
                            </div>
                            <Switch
                              checked={settings.privacy.twoFactorAuth}
                              onCheckedChange={(checked) => updateSetting('privacy', 'twoFactorAuth', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Save Login Credentials</Label>
                              <p className="text-xs text-gray-500">
                                Remember login on this device
                              </p>
                            </div>
                            <Switch
                              checked={settings.privacy.saveLoginCredentials}
                              onCheckedChange={(checked) => updateSetting('privacy', 'saveLoginCredentials', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Biometric Login</Label>
                              <p className="text-xs text-gray-500">
                                Use fingerprint or face recognition
                              </p>
                            </div>
                            <Switch
                              checked={settings.privacy.biometricLogin}
                              onCheckedChange={(checked) => updateSetting('privacy', 'biometricLogin', checked)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Password Change */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Change Password</h3>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                              <Input
                                id="currentPassword"
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                placeholder="Enter current password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">New Password</Label>
                              <div className="relative">
                                <Input
                                  id="newPassword"
                                  type={showNewPassword ? 'text' : 'password'}
                                  value={passwordData.newPassword}
                                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                  placeholder="Enter new password"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm Password</Label>
                              <div className="relative">
                                <Input
                                  id="confirmPassword"
                                  type={showConfirmPassword ? 'text' : 'password'}
                                  value={passwordData.confirmPassword}
                                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                  placeholder="Confirm new password"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button 
                              onClick={updatePassword}
                              disabled={loading}
                              className="gap-2"
                            >
                              {loading ? (
                                <>
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <Key className="h-4 w-4" />
                                  Update Password
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* App Settings Tab */}
                <TabsContent value="app" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>App Preferences</CardTitle>
                      <CardDescription>
                        Configure app behavior and performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Performance Settings */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Performance</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Data Saver Mode</Label>
                              <p className="text-xs text-gray-500">
                                Reduce data usage for slower connections
                              </p>
                            </div>
                            <Switch
                              checked={settings.app.dataSaver}
                              onCheckedChange={(checked) => updateSetting('app', 'dataSaver', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Auto Update</Label>
                              <p className="text-xs text-gray-500">
                                Automatically update app when available
                              </p>
                            </div>
                            <Switch
                              checked={settings.app.autoUpdate}
                              onCheckedChange={(checked) => updateSetting('app', 'autoUpdate', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Background Refresh</Label>
                              <p className="text-xs text-gray-500">
                                Refresh content when app is in background
                              </p>
                            </div>
                            <Switch
                              checked={settings.app.backgroundRefresh}
                              onCheckedChange={(checked) => updateSetting('app', 'backgroundRefresh', checked)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Cache Settings */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Cache Duration</Label>
                            <p className="text-xs text-gray-500">
                              How long to store cached data
                            </p>
                          </div>
                          <Select 
                            value={settings.app.cacheDuration}
                            onValueChange={(value) => updateSetting('app', 'cacheDuration', value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 day</SelectItem>
                              <SelectItem value="3">3 days</SelectItem>
                              <SelectItem value="7">7 days</SelectItem>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="0">Never cache</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              toast.success('Cache cleared successfully');
                            }}
                            className="gap-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Clear App Cache
                          </Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Feedback Settings */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Feedback & Interaction</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Vibration Feedback</Label>
                              <p className="text-xs text-gray-500">
                                Vibrate on actions and notifications
                              </p>
                            </div>
                            <Switch
                              checked={settings.app.vibrationFeedback}
                              onCheckedChange={(checked) => updateSetting('app', 'vibrationFeedback', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Haptic Feedback</Label>
                              <p className="text-xs text-gray-500">
                                Tactile feedback for interactions
                              </p>
                            </div>
                            <Switch
                              checked={settings.app.hapticFeedback}
                              onCheckedChange={(checked) => updateSetting('app', 'hapticFeedback', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Animation Speed</Label>
                              <p className="text-xs text-gray-500">
                                Speed of UI animations
                              </p>
                            </div>
                            <Select 
                              value={settings.app.animationSpeed}
                              onValueChange={(value) => updateSetting('app', 'animationSpeed', value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fast">Fast</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="slow">Slow</SelectItem>
                                <SelectItem value="none">No animations</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Import/Export Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Data Management</CardTitle>
                      <CardDescription>
                        Backup and restore your settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button 
                          variant="outline" 
                          className="gap-2"
                          onClick={exportSettings}
                        >
                          <Download className="h-4 w-4" />
                          Export Settings
                        </Button>
                        
                        <div>
                          <input
                            type="file"
                            id="import-settings"
                            accept=".json"
                            onChange={importSettings}
                            className="hidden"
                          />
                          <Label htmlFor="import-settings">
                            <Button 
                              variant="outline" 
                              className="gap-2 w-full"
                              asChild
                            >
                              <span>
                                <Upload className="h-4 w-4" />
                                Import Settings
                              </span>
                            </Button>
                          </Label>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        <p>• Export creates a JSON file with all your settings</p>
                        <p>• Import will replace all current settings</p>
                        <p>• Always backup before importing new settings</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Danger Zone */}
                  <Card className="border-red-200">
                    <CardHeader>
                      <CardTitle className="text-red-700">Danger Zone</CardTitle>
                      <CardDescription>
                        Irreversible actions that cannot be undone
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-red-700">Delete All Data</Label>
                            <p className="text-xs text-gray-600">
                              Permanently delete all your parking history and settings
                            </p>
                          </div>
                          <Button 
                            variant="destructive"
                            className="gap-2"
                            onClick={() => {
                              toast.error('This feature is disabled in demo mode');
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete All
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-red-700">Deactivate Account</Label>
                            <p className="text-xs text-gray-600">
                              Temporarily disable your parking system account
                            </p>
                          </div>
                          <Button 
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 gap-2"
                            onClick={() => {
                              toast.error('This feature is disabled in demo mode');
                            }}
                          >
                            <Lock className="h-4 w-4" />
                            Deactivate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}