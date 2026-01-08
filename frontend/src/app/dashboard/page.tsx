'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Loader2, Car, MapPin, Plus, Calendar,
  AlertCircle, ParkingCircle,
  Ticket, QrCode, Bell, Building, Shield, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { 
  SidebarProvider, 
  SidebarTrigger,
  SidebarInset 
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useAuth } from '@/context/AuthContext';

/* ================= MOCK DATA ================= */
const mockDashboardData = {
  user_stats: {
    total_reservations: 12,
    active_reservations: 1,
    total_savings: 0,
    favorite_location: 'Parkir Motor - Gerbang Utama',
    registered_vehicles: 2
  },
  quick_stats: {
    total_capacity: 560,
    current_occupancy: 320,
    peak_hours: '08:00 - 10:00',
    most_popular: 'Parkir Motor - Gerbang Utama',
    occupancy_rate: 57.1
  }
};

interface DashboardData {
  user_stats: {
    total_reservations: number;
    active_reservations: number;
    total_savings: number;
    favorite_location: string;
    registered_vehicles: number;
  };
  quick_stats: {
    total_capacity: number;
    current_occupancy: number;
    peak_hours: string;
    most_popular: string;
    occupancy_rate: number;
  };
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setDashboardData(mockDashboardData);
    setLoading(false);
  };

  const handleQuickReservation = () => {
    toast.success(
      <div className="space-y-1">
        <p className="font-semibold">Reservasi Cepat Berhasil</p>
        <p className="text-xs">Lokasi: {dashboardData?.user_stats.favorite_location}</p>
      </div>
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const occupancyPercentage =
    (dashboardData!.quick_stats.current_occupancy /
      dashboardData!.quick_stats.total_capacity) *
    100;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Top Bar */}
        <div className="sticky top-0 z-50 border-b bg-white/90">
          <div className="flex h-16 items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="font-bold">Dashboard</h1>
              <p className="text-xs text-gray-500">Politeknik Negeri Batam</p>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Link href="/booking">
                <Button size="sm" className="bg-green-600">
                  <Plus className="h-4 w-4 mr-1" />
                  Reservasi
                </Button>
              </Link>

              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                  {user?.first_name?.[0] || 'U'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-medium">
                    {user?.category === 'dosen' ? 'Dosen' : 'Mahasiswa'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main */}
        <main className="p-4 lg:p-6 bg-gradient-to-b from-blue-50/20 to-white">
          {/* Greeting */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {getGreeting()}, {user?.first_name || 'Pengguna'} 👋
            </h1>
            <p className="text-sm text-gray-600">
              Sistem Parkir Politeknik Negeri Batam
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Reservasi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{dashboardData?.user_stats.total_reservations}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Reservasi Aktif</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{dashboardData?.user_stats.active_reservations}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Kendaraan Terdaftar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{dashboardData?.user_stats.registered_vehicles}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Lokasi Favorit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm truncate">{dashboardData?.user_stats.favorite_location}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={handleQuickReservation}
                >
                  <QrCode className="h-3 w-3 mr-1" />
                  Reservasi Cepat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Capacity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Kapasitas Parkir Kampus
              </CardTitle>
              <CardDescription>Statistik penggunaan parkir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>{dashboardData?.quick_stats.current_occupancy} digunakan</span>
                <span>{occupancyPercentage.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${occupancyPercentage}%` }}
                />
              </div>
              <div className="text-sm text-gray-600">
                Jam sibuk: <strong>{dashboardData?.quick_stats.peak_hours}</strong>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}