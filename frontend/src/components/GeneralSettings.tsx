// app/settings/components/GeneralSettings.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { GeneralSettings as GeneralSettingsType } from '../types';

interface GeneralSettingsProps {
  settings: GeneralSettingsType;
  onUpdate: (key: string, value: string) => void;
}

export function GeneralSettings({ settings, onUpdate }: GeneralSettingsProps) {
  return (
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
              value={settings.language}
              onValueChange={(value) => onUpdate('language', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">
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
              value={settings.timezone}
              onValueChange={(value) => onUpdate('timezone', value)}
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
              value={settings.dateFormat}
              onValueChange={(value) => onUpdate('dateFormat', value)}
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
              value={settings.timeFormat}
              onValueChange={(value) => onUpdate('timeFormat', value)}
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
              variant={settings.theme === 'light' ? 'default' : 'outline'}
              className="flex-col h-auto py-4"
              onClick={() => onUpdate('theme', 'light')}
            >
              <div className="w-8 h-8 rounded-full bg-yellow-100 border-2 border-yellow-300 mb-2 flex items-center justify-center">
                <span className="text-lg">☀️</span>
              </div>
              <span className="text-sm">Light</span>
            </Button>
            
            <Button
              type="button"
              variant={settings.theme === 'dark' ? 'default' : 'outline'}
              className="flex-col h-auto py-4"
              onClick={() => onUpdate('theme', 'dark')}
            >
              <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-600 mb-2 flex items-center justify-center">
                <span className="text-lg">🌙</span>
              </div>
              <span className="text-sm">Dark</span>
            </Button>
            
            <Button
              type="button"
              variant={settings.theme === 'auto' ? 'default' : 'outline'}
              className="flex-col h-auto py-4"
              onClick={() => onUpdate('theme', 'auto')}
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
  );
}