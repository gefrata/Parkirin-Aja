'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Car, Clock, MapPin, ArrowLeft, Map, Navigation, Layers, Locate, Building, GraduationCap, Bike, Users, Shield, CheckCircle, AlertCircle, Plus, Home, Split, Maximize2, Minimize2, Motorbike } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { 
  SidebarProvider, 
  SidebarTrigger,
  SidebarInset 
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';

// Dynamic import dengan fallback yang lebih baik
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Memuat peta...</p>
      </div>
    </div>
  ),
});

// Data parkir GRATIS untuk Polibatam
const polibatamParkingLots = [
  {
    id: '1',
    name: 'Parkir Motor',
    available_slots: 100,
    total_slots: 100,
    lat: 1.119295,
    lng: 104.048859,
    type: 'motor'
  },
  {
    id: '2',
    name: 'Parkir Motor',
    available_slots: 100,
    total_slots: 100,
    lat: 1.119198,
    lng: 104.048202,
    type: 'motor'
  },
  {
    id: '3',
    name: 'Parkir Motor',
    available_slots: 100,
    total_slots: 100,
    lat: 1.119054,
    lng: 104.049371,
    type: 'motor'
  },
  {
    id: '4',
    name: 'Parkir Mobil',
    available_slots: 50,
    total_slots: 50,
    lat: 1.118767,
    lng: 104.047710,
    type: 'mobil'
  },
  {
    id: '5',
    name: 'Parkir Mobil',
    available_slots: 50,
    total_slots: 50,
    lat: 1.119198,
    lng: 104.048202,
    type: 'mobil'
  },
  {
    id: '6',
    name: 'Parkir Mobil - Khusus Dosen',
    available_slots: 50,
    total_slots: 50,
    lat: 1.118670,
    lng: 104.049281,
    type: 'mobil'
  },
];

// Tipe kendaraan yang disederhanakan
const vehicleTypes = [
  { id: '1', name: 'Sepeda Motor', value: 'motor', icon: <Motorbike /> },
  { id: '2', name: 'Mobil', value: 'mobil', icon: <Car /> },
];

// Koordinat pusat Polibatam
const POLIBATAM_CENTER: [number, number] = [1.119000, 104.048500];

export default function BookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    parking_lot_id: '',
    vehicle_number: '',
    vehicle_type: 'motor',
    purpose: '',
  });
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [filteredLots, setFilteredLots] = useState(polibatamParkingLots);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { user } = useAuth();

  const [agree, setAgree] = useState(false);

  // Filter parking berdasarkan tipe kendaraan yang dipilih
  useEffect(() => {
    let filtered = [...polibatamParkingLots];
  
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lot =>
        lot.name.toLowerCase().includes(query)
      );
    }
  
    if (formData.vehicle_type) {
      filtered = filtered.filter(lot => lot.type === formData.vehicle_type);
    }
  
    setFilteredLots(filtered);
  }, [searchQuery, formData.vehicle_type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('access_token')
        : null;
  
    if (!token) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }
  
    if (!formData.parking_lot_id) {
      toast.error('Silakan pilih lokasi parkir');
      return;
    }
  
    if (!selectedParkingLot) {
      toast.error('Data lokasi parkir tidak valid');
      return;
    }
  
    if (!formData.vehicle_number || !formData.purpose) {
      toast.error('Harap isi semua field yang diperlukan');
      return;
    }
  
    setLoading(true);
  
    // ✅ PAYLOAD HARUS ADA
    const payload = {
      parking_lot_id: formData.parking_lot_id,
      parking_lot_name: selectedParkingLot.name,
      vehicle_number: formData.vehicle_number,
      vehicle_type: formData.vehicle_type,
      purpose: formData.purpose,
    };
  
    try {
      const res = await fetch('http://127.0.0.1:8000/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || 'Booking gagal');
      }
  
      toast.success('Reservasi berhasil');
      router.push(`/reservasi/${data.id}`);
  
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Reservasi gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }; // ⬅️ ⬅️ ⬅️ INI YANG SEBELUMNYA HILANG
  

  
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Browser tidak mendukung geolokasi');
      return;
    }

    setMapLoading(true);
    toast.info('Mendeteksi lokasi Anda...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        toast.success('Lokasi terdeteksi!');
        setMapLoading(false);
      },
      (error) => {
        toast.error('Tidak dapat mengambil lokasi');
        console.error(error);
        setMapLoading(false);
      }
    );
  };

  const selectedParkingLot = polibatamParkingLots.find(lot => lot.id === formData.parking_lot_id);

  // Statistics for summary
  const parkingStats = useMemo(() => {
    const totalSlots = polibatamParkingLots.reduce((sum, lot) => sum + lot.total_slots, 0);
    const availableSlots = polibatamParkingLots.reduce((sum, lot) => sum + lot.available_slots, 0);
    const occupancyRate = ((totalSlots - availableSlots) / totalSlots * 100).toFixed(1);
    
    const byCategory = {
      motor: polibatamParkingLots.filter(lot => lot.type === 'motor').length,
      mobil: polibatamParkingLots.filter(lot => lot.type === 'mobil').length,
    };
    
    return { totalSlots, availableSlots, occupancyRate, byCategory };
  }, []);

  const handleLotSelectFromMap = (lotId: string) => {
    setFormData(prev => ({ ...prev, parking_lot_id: lotId }));
    toast.success('Lokasi parkir telah dipilih');
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Handle ESC key to exit full screen
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isFullScreen]);

  // Reset selection jika mengubah tipe kendaraan
  useEffect(() => {
    if (formData.parking_lot_id) {
      const selectedLot = polibatamParkingLots.find(
        lot => lot.id === formData.parking_lot_id
      );
      if (!selectedParkingLot) {
        toast.error('Lokasi parkir tidak ditemukan');
        return;
      }
    }
  }, [formData.vehicle_type, formData.parking_lot_id]);

    return (    
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Top Navigation Bar */}
        <AppHeader
          title="Reservasi Parkir"
          subtitle="Pilih lokasi parkir dan lakukan reservasi secara gratis"
          action={
          <div className="flex gap-2">
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              Dashboard
            </Button>
          </Link>
           </div>
           }
        />

        <main className={`p-4 md:p-6 lg:p-8 bg-gradient-to-b from-blue-50/20 to-white min-h-screen ${isFullScreen ? 'hidden' : ''}`}>
          
          {/* Important Notice - Jam Akses */}
          <Card className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg">
                  <AlertCircle className="h-8 w-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">Perhatian Jam Akses Gerbang</h3>
                  <p className="text-gray-600">
                    <span className="font-semibold text-amber-700">Gerbang kampus ditutup pukul 23:00 - 06:00</span>
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-white text-amber-700 border-amber-300">
                      06:00 - 23:00: Gerbang terbuka
                    </Badge>
                    <Badge variant="outline" className="bg-white text-amber-700 border-amber-300">
                      23:00 - 06:00: Gerbang terkunci
                    </Badge>
                    <Badge variant="outline" className="bg-white text-blue-700 border-blue-300">
                      Parkir dosen/staff: 24 jam (kartu akses)
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Pastikan kendaraan sudah keluar sebelum pukul 23:00 atau akan terkunci sampai besok pagi!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-500">Total Kapasitas</p>
                <p className="text-2xl font-bold">{parkingStats.totalSlots} slot</p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-500">Tersedia Sekarang</p>
                <p className="text-2xl font-bold text-green-600">{parkingStats.availableSlots} slot</p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-500">Tingkat Hunian</p>
                <p className="text-2xl font-bold">{parkingStats.occupancyRate}%</p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-500">Lokasi Parkir</p>
                <p className="text-2xl font-bold">{polibatamParkingLots.length} area</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Location Controls */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={getUserLocation}
                disabled={mapLoading}
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Navigation className="h-4 w-4" />
                <span className="truncate">
                  {mapLoading ? 'Mendeteksi...' : 'Lokasi Saya'}
                </span>
              </Button>
              
              <div className="relative w-full">
                <Input
                  placeholder="Cari lokasi parkir..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Split Layout: Form dan Peta Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Kiri: Form Reservasi */}
            <Card id="booking-form" className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Form Reservasi Parkir
                </CardTitle>
                <CardDescription>
                  Pilih lokasi parkir dari peta atau dropdown
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
                  {/* Parking Lot Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="parking_lot" className="text-base">
                        Lokasi Parkir *
                      </Label>
                      {formData.parking_lot_id && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, parking_lot_id: '' }))}
                          className="h-7 text-xs"
                        >
                          Hapus pilihan
                        </Button>
                      )}
                    </div>
                    
                    {/* Dropdown untuk memilih parkir */}
                    <div className="space-y-2">
                      <Select 
                        value={formData.parking_lot_id} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, parking_lot_id: value }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih lokasi parkir">
                            {formData.parking_lot_id && selectedParkingLot && (
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  selectedParkingLot.available_slots > 20 ? 'bg-green-500' : 
                                  selectedParkingLot.available_slots > 0 ? 'bg-yellow-500' : 'bg-red-500'
                                }`} />
                                <span className="truncate">{selectedParkingLot.name}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <div className="max-h-[300px] overflow-y-auto">
                            {filteredLots.length > 0 ? (
                              filteredLots.map((lot) => (
                                <SelectItem key={lot.id} value={lot.id}>
                                  <div className="flex justify-between items-center w-full py-1">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-2 h-2 rounded-full ${
                                        lot.available_slots > 20 ? 'bg-green-500' : 
                                        lot.available_slots > 0 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`} />
                                      <div>
                                        <span className="block font-medium">{lot.name}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                                            {lot.type === 'motor' ? 'Motor' : 
                                             lot.type === 'mobil' ? 'Mobil' : 'Sepeda'}
                                          </Badge>
                                          <span className="text-xs text-gray-500">
                                            {lot.available_slots}/{lot.total_slots} slot
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))
                            ) : (
                              <div className="py-4 text-center text-gray-500">
                                Tidak ada lokasi parkir yang sesuai
                              </div>
                            )}
                          </div>
                        </SelectContent>
                      </Select>
                      
                      {/* Pesan jika tidak ada hasil pencarian */}
                      {searchQuery && filteredLots.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          Tidak ditemukan parkir untuk "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>

{/* Form Inputs */}
{/* Form Inputs */}
<div className="space-y-5 flex-1">

  {/* Row: Jenis Kendaraan + Keperluan */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* Jenis Kendaraan */}
    <div className="space-y-2">
      <Label htmlFor="vehicle_type">Jenis Kendaraan *</Label>
      <Select
        value={formData.vehicle_type}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, vehicle_type: value }))
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih jenis kendaraan" />
        </SelectTrigger>
        <SelectContent>
          {vehicleTypes.map((type) => (
            <SelectItem key={type.id} value={type.value}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{type.icon}</span>
                <span>{type.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-gray-500">
        Sesuai dengan lokasi parkir
      </p>
    </div>

    {/* Keperluan ke Kampus */}
    <div className="space-y-2">
      <Label htmlFor="purpose">Keperluan ke Kampus *</Label>
      <Select
        value={formData.purpose}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, purpose: value }))
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih keperluan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="kuliah">Kuliah / Akademik</SelectItem>
          <SelectItem value="kerja">Dosen / Staff</SelectItem>
          <SelectItem value="perpustakaan">Perpustakaan</SelectItem>
          <SelectItem value="rapat">Rapat / Meeting</SelectItem>
          <SelectItem value="kegiatan">Kegiatan Mahasiswa</SelectItem>
          <SelectItem value="lainnya">Lainnya</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-gray-500">
        Tujuan Anda datang ke kampus
      </p>
    </div>
  </div>

  {/* Nomor Kendaraan */}
  <div className="space-y-2">
    <Label htmlFor="vehicle_number">Nomor Kendaraan *</Label>
    <Input
      id="vehicle_number"
      placeholder="BP 1234 XYZ"
      value={formData.vehicle_number}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          vehicle_number: e.target.value.toUpperCase(),
        }))
      }
      className="text-lg tracking-wider uppercase"
    />
    <p className="text-xs text-gray-500">
      Masukkan nomor polisi lengkap
    </p>
  </div>

  {/* Persetujuan */}
  <div className="flex items-start gap-3 rounded-lg border p-4 bg-gray-50">
    <input
      type="checkbox"
      id="agree"
      checked={agree}
      onChange={(e) => setAgree(e.target.checked)}
      className="mt-1 h-4 w-4 accent-green-600"
      required
    />
    <Label htmlFor="agree" className="text-sm leading-relaxed cursor-pointer">
      Saya menyetujui dan mematuhi aturan dan ketentuan parkir Polibatam, termasuk jam akses gerbang dan kebijakan keamanan kampus.
    </Label>
  </div>

</div>



                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    size="lg" 
                    disabled={
                      loading ||
                      !formData.parking_lot_id ||
                      !formData.vehicle_number ||
                      !formData.purpose ||
                      !agree
                    }                  
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Memproses...
                      </>
                    ) : (
                      <>
                        Reservasi Parkir
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm text-gray-500 pt-4 border-t">
                    <p>Dengan melakukan reservasi, Anda menyetujui peraturan parkir Polibatam</p>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Kanan: Peta Interaktif */}
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    Pilih Parkir di Peta
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleFullScreen}
                    className="flex items-center gap-2"
                  >
                    {isFullScreen ? (
                      <>
                        <Minimize2 className="h-4 w-4" />
                        Keluar Full Screen
                      </>
                    ) : (
                      <>
                        <Maximize2 className="h-4 w-4" />
                        Full Screen
                      </>
                    )}
                  </Button>
                </div>
                <CardDescription>
                  Klik ikon parkir untuk memilih lokasi
                  {userLocation && (
                    <span className="ml-2 text-green-600">
                      • Menggunakan lokasi Anda
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <LeafletMap
                  parkingLots={filteredLots}
                  selectedLotId={formData.parking_lot_id}
                  userLocation={userLocation}
                  onSelectLot={handleLotSelectFromMap}
                  height="500px"
                  center={POLIBATAM_CENTER}
                  zoom={18}
                  showLegend={false}
                  showDetails={false}
                />
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Full Screen Map View */}
        {isFullScreen && (
          <div className="fixed inset-0 z-50 bg-white">
            <div className="absolute top-0 left-0 right-0 bg-white border-b z-10">
              <div className="flex items-center justify-between h-16 px-4">
                <div className="flex items-center gap-3">
                  <Map className="h-6 w-6 text-blue-600" />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Peta Parkir Polibatam</h1>
                    <p className="text-sm text-gray-500">Mode full screen - Klik ikon parkir untuk memilih</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {selectedParkingLot && (
                    <div className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg">
                      <p className="text-sm font-medium">📍 {selectedParkingLot.name}</p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleFullScreen}
                    className="flex items-center gap-2"
                  >
                    <Minimize2 className="h-4 w-4" />
                    Keluar Full Screen
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="pt-16 h-full">
              <LeafletMap
                parkingLots={filteredLots}
                selectedLotId={formData.parking_lot_id}
                userLocation={userLocation}
                onSelectLot={handleLotSelectFromMap}
                height="100%"
                center={POLIBATAM_CENTER}
                zoom={18}
                showLegend={false}
                showDetails={false}
              />
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}