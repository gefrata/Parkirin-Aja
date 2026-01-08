// components/AppSidebar.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Home,
  Car,
  MapPin,
  History,
  User,
  Settings,
  LogOut,
  Bell,
  CreditCard,
  Shield,
  GraduationCap,
  Building,
  QrCode,
  Calendar,
  BarChart3,
  HelpCircle,
  Mail,
  Phone,
  Ticket,
  BookOpen,
  Users,
  FileText,
  AlertCircle
} from 'lucide-react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Data sidebar untuk sistem parkir Polibatam
  const sidebarData = {
    userInfo: {
      name: user ? `${user.first_name} ${user.last_name}` : 'User',
      email: user?.email || 'user@polibatam.ac.id',
      role: user?.category === 'dosen' ? 'Dosen' : 'Mahasiswa',
      nim: user?.nim || '',
      faculty: user?.faculty || 'Politeknik Negeri Batam',
      studyProgram: user?.study_program || '',
      avatar: user?.avatar || '/default-avatar.png'
    },
    
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: <Home className="h-4 w-4" />,
        badge: null
      },
      {
        title: "Book Parking",
        url: "/booking",
        icon: <MapPin className="h-4 w-4" />,
        badge: null
      },
      {
        title: "My Vehicles",
        url: "/profile?tab=vehicles",
        icon: <Car className="h-4 w-4" />,
        badge: user?.category === 'mahasiswa' ? 'STNK' : null
      },
      {
        title: "Parking History",
        url: "/history",
        icon: <History className="h-4 w-4" />,
        badge: "24"
      },
      {
        title: "Active Tickets",
        url: "/tickets",
        icon: <Ticket className="h-4 w-4" />,
        badge: "2"
      },
    ],
    
    navCampus: [
      {
        title: "Polibatam Info",
        url: "#",
        icon: <Building className="h-4 w-4" />,
        items: [
          {
            title: "Campus Map",
            url: "/map",
            icon: <MapPin className="h-3 w-3" />
          },
          {
            title: "Parking Regulations",
            url: "/regulations",
            icon: <FileText className="h-3 w-3" />
          },
          {
            title: "Faculty Parking",
            url: user?.category === 'dosen' ? "/faculty-parking" : "#",
            icon: <Shield className="h-3 w-3" />,
            disabled: user?.category !== 'dosen'
          },
          {
            title: "Student Parking",
            url: user?.category === 'mahasiswa' ? "/student-parking" : "#",
            icon: <GraduationCap className="h-3 w-3" />,
            disabled: user?.category !== 'mahasiswa'
          },
        ]
      },
      {
        title: "Account",
        url: "#",
        icon: <User className="h-4 w-4" />,
        items: [
          {
            title: "My Profile",
            url: "/profile",
            icon: <User className="h-3 w-3" />
          },
          {
            title: "Vehicle Registration",
            url: "/profile?tab=vehicles",
            icon: <Car className="h-3 w-3" />
          },          
          {
            title: "Notifications",
            url: "/notifications",
            icon: <Bell className="h-3 w-3" />
          },
        ]
      },
    ],
    
    navAdmin: user?.role === 'lecturer' ? [
      {
        title: "Faculty Tools",
        url: "#",
        icon: <Shield className="h-4 w-4" />,
        items: [
          {
            title: "Parking Analytics",
            url: "/analytics",
            icon: <BarChart3 className="h-3 w-3" />
          },
          {
            title: "Report Management",
            url: "/reports",
            icon: <FileText className="h-3 w-3" />
          },
          {
            title: "Student Verification",
            url: "/verifications",
            icon: <Users className="h-3 w-3" />
          },
        ]
      }
    ] : [],
    
    navSupport: [
      {
        title: "Help & Support",
        url: "#",
        icon: <HelpCircle className="h-4 w-4" />,
        items: [
          {
            title: "Contact Security",
            url: "/contact-security",
            icon: <Phone className="h-3 w-3" />
          },
          {
            title: "Helpdesk",
            url: "/helpdesk",
            icon: <HelpCircle className="h-3 w-3" />
          },
          {
            title: "FAQ",
            url: "/faq",
            icon: <HelpCircle className="h-4 w-4" />,
            badge: null
          },
          {
            title: "Report Issue",
            url: "/report-issue",
            icon: <AlertCircle className="h-3 w-3" />
          },
        ]
      },
    ]
  };

  // Check if current path is active
  const isActive = (url: string) => {
    if (url.includes('?')) {
      return pathname === url.split('?')[0];
    }
    return pathname === url;
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.first_name && !user?.last_name) return 'U';
    return `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase();
  };

  return (
    <Sidebar {...props} className="border-r border-gray-200">
      {/* Sidebar Header with User Info */}
      <SidebarHeader className="p-6 border-b">
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="h-16 w-16 border-2 border-blue-500 shadow-md">
            <AvatarImage src={sidebarData.userInfo.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-lg">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 text-sm">{sidebarData.userInfo.name}</h3>
            <p className="text-xs text-gray-500 truncate max-w-[180px]">{sidebarData.userInfo.email}</p>
            
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs px-2">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  {sidebarData.userInfo.role}
                </Badge>
                {sidebarData.userInfo.nim && (
                  <Badge variant="secondary" className="text-xs font-mono px-2">
                    {sidebarData.userInfo.nim}
                  </Badge>
                )}
              </div>
              
              {sidebarData.userInfo.studyProgram && (
                <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                  {sidebarData.userInfo.studyProgram}
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                {sidebarData.userInfo.faculty}
              </div>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-6">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarData.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url} className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600">{item.icon}</span>
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge 
                          variant={item.badge === 'STNK' ? "default" : "outline"} 
                          className={`text-xs ${
                            item.badge === 'STNK' 
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-100" 
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Campus & Account */}
        {sidebarData.navCampus.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.url)}
                      disabled={item.disabled}
                    >
                      <Link 
                        href={item.disabled ? '#' : item.url} 
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          item.disabled 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={(e) => {
                          if (item.disabled) {
                            e.preventDefault();
                            return;
                          }
                          if (item.url.startsWith('tel:') || item.url.startsWith('mailto:')) {
                            window.open(item.url, '_blank');
                          }
                        }}
                      >
                        {item.icon && <span className="text-gray-500">{item.icon}</span>}
                        <span className="text-sm">{item.title}</span>
                        {item.disabled && (
                          <Badge variant="outline" className="ml-auto text-xs px-2 py-0">
                            Restricted
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Faculty Tools (for lecturers only) */}
        {sidebarData.navAdmin.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Faculty Tools
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarData.navAdmin[0].items?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link 
                        href={item.url} 
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-gray-500">{item.icon}</span>
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Help & Support */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Help & Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarData.navSupport[0].items?.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => {
                        if (item.url.startsWith('tel:') || item.url.startsWith('mailto:')) {
                          window.open(item.url, '_blank');
                        } else {
                          window.location.href = item.url;
                        }
                      }}
                    >
                      {item.icon && <span className="text-gray-500">{item.icon}</span>}
                      <span className="text-sm">{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full justify-start gap-2 text-xs"
              onClick={() => window.location.href = '/booking'}
            >
              <QrCode className="h-3 w-3" />
              Generate QR Code
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="w-full justify-start gap-2 text-xs"
              onClick={() => window.location.href = '/settings'}
            >
              <Settings className="h-3 w-3" />
              Settings
            </Button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            onClick={logout}
            size="sm"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}