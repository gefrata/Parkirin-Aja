// app/settings/components/SettingsTabs.tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Bell, Car, Shield, Smartphone } from 'lucide-react';
import { ReactNode } from 'react';

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: {
    general: ReactNode;
    notifications: ReactNode;
    parking: ReactNode;
    privacy: ReactNode;
    app: ReactNode;
  };
}

export function SettingsTabs({ activeTab, onTabChange, children }: SettingsTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
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

      <TabsContent value="general" className="space-y-6">
        {children.general}
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        {children.notifications}
      </TabsContent>

      <TabsContent value="parking" className="space-y-6">
        {children.parking}
      </TabsContent>

      <TabsContent value="privacy" className="space-y-6">
        {children.privacy}
      </TabsContent>

      <TabsContent value="app" className="space-y-6">
        {children.app}
      </TabsContent>
    </Tabs>
  );
}