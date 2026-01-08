'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  QrCode, 
  Car, 
  CheckCircle, 
  Download, 
  Share2, 
  Home,
  ArrowLeft,
  Shield,
  Building,
  AlertTriangle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Image from 'next/image';

// Helper function untuk format waktu countdown
const formatCountdown = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types untuk data reservasi
interface ReservationData {
  id: number;
  reservation_code: string;
  parking_lot: {
    id: number;
    name: string;
    address: string;
    type: 'motor' | 'mobil' | 'sepeda';
    category: string;
    gate_access: string;
  };
  vehicle_type: string;
  vehicle_number: string;
  purpose: string;
  reservation_time: string;
  expiry_time: string;
  status: 'active' | 'expired' | 'used' | 'cancelled' | 'completed';
  qr_code_url: string;
  estimated_duration: number;
}

export default function ReservationPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(900);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fungsi untuk mendapatkan token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  };

  // Fungsi untuk fetch data reservasi dari Laravel
  const fetchReservationData = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const reservationId = params.id;
      const token = getAuthToken();
      
      if (!token) {
        toast.error('Silakan login terlebih dahulu');
        router.push('/login');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
      

      if (response.status === 401) {
        toast.error('Sesi telah berakhir, silakan login kembali');
        localStorage.removeItem('access_token');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Gagal mengambil data reservasi');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Terjadi kesalahan');
      }

      const reservation: ReservationData = result.data;
      
      setReservationData(reservation);
      
      // Set QR Code image dari URL yang diberikan Laravel
      if (reservation.qr_code_url) {
        setQrCodeImage(reservation.qr_code_url);
      }

      // Hitung countdown dari waktu kadaluarsa
      const expiryTime = new Date(reservation.expiry_time).getTime();
      const now = Date.now();
      const timeLeft = Math.max(0, Math.floor((expiryTime - now) / 1000));
      
      setCountdown(timeLeft);
      setIsExpired(reservation.status === 'expired' || timeLeft <= 0);

      if (reservation.status === 'active' && timeLeft > 0) {
        toast.success('Reservasi ditemukan!', {
          description: 'QR Code berlaku 15 menit'
        });
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching reservation:', error);
      setFetchError(error.message || 'Gagal memuat data reservasi');
      toast.error('Gagal memuat data reservasi', {
        description: error.message
      });
      
      // Fallback ke data dummy jika API error untuk development
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          const mockData: ReservationData = {
            id: 1,
            reservation_code: `PB-${Date.now().toString().slice(-6)}`,
            parking_lot: {
              id: 1,
              name: 'Parkir Motor - Gerbang Utama',
              address: 'Depan Gedung Rektorat, Polibatam',
              type: 'motor',
              category: 'mahasiswa',
              gate_access: 'Gerbang utama 06:00-23:00'
            },
            vehicle_type: 'motor',
            vehicle_number: 'BP 1234 XYZ',
            purpose: 'kuliah',
            reservation_time: new Date().toISOString(),
            expiry_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            status: 'active',
            qr_code_url: `${API_BASE_URL}/storage/qr-codes/PB-${Date.now().toString().slice(-6)}.png`,
            estimated_duration: 120
          };
          
          setReservationData(mockData);
          setQrCodeImage(mockData.qr_code_url);
          setCountdown(900);
          setIsExpired(false);
          setLoading(false);
          
          toast.success('Reservasi berhasil dimuat!', {
            description: 'Menggunakan data simulasi untuk development'
          });
        }, 1000);
      } else {
        setLoading(false);
      }
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (!reservationData || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          
          // Update status di backend ketika expired
          updateReservationStatus('expired');
          
          toast.error('QR Code telah kadaluarsa!', {
            description: 'Silakan buat reservasi baru'
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [reservationData]);

  // Fungsi untuk update status reservasi di backend
  const updateReservationStatus = async (status: 'expired' | 'used' | 'cancelled') => {
    try {
      const token = getAuthToken();
      if (!token) return;

      await fetch(`${API_BASE_URL}/reservations/${params.id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Error updating reservation status:', error);
    }
  };

  // Fetch data saat component mount
  useEffect(() => {
    fetchReservationData();
  }, [params.id]);

  const handleDownloadQR = async () => {
    if (isExpired) {
      toast.error('QR Code telah kadaluarsa', {
        description: 'Tidak dapat mengunduh QR Code yang sudah kadaluarsa'
      });
      return;
    }

    if (!qrCodeImage) {
      toast.error('QR Code tidak tersedia');
      return;
    }

    try {
      // Download QR code dari backend
      const token = getAuthToken();
      const headers: any = {};
      
      if (token && qrCodeImage.includes(API_BASE_URL)) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(qrCodeImage, { headers });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-code-${reservationData?.reservation_code}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('QR Code berhasil diunduh!');
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Gagal mengunduh QR Code');
    }
  };

  const handleShare = () => {
    if (isExpired) {
      toast.error('QR Code telah kadaluarsa', {
        description: 'Tidak dapat membagikan QR Code yang sudah kadaluarsa'
      });
      return;
    }

    if (navigator.share) {
      navigator.share({
        title: 'Reservasi Parkir Polibatam',
        text: `Reservasi parkir saya di ${reservationData?.parking_lot?.name} - Kode: ${reservationData?.reservation_code} - Berlaku ${formatCountdown(countdown)} menit lagi`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link berhasil disalin ke clipboard!');
    }
  };

  const handleRefreshQR = async () => {
    // Hanya bisa refresh jika masih dalam waktu 15 menit dan belum expired
    if (countdown > 0 && !isExpired) {
      try {
        setRefreshing(true);
        const token = getAuthToken();
        if (!token) {
          toast.error('Silakan login terlebih dahulu');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/reservations/${params.id}/refresh-qr`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Gagal memperbarui QR Code');
        }

        if (result.success) {
          setQrCodeImage(result.data.qr_code_url);
          setCountdown(900); // Reset ke 15 menit
          setIsExpired(false);
          toast.success('QR Code berhasil diperbarui!', {
            description: 'QR Code baru berlaku 15 menit'
          });
          // Refresh data reservasi
          fetchReservationData();
        }
      } catch (error: any) {
        toast.error('Gagal memperbarui QR Code', {
          description: error.message
        });
      } finally {
        setRefreshing(false);
      }
    }
  };

  const handleCancelReservation = async () => {
    if (!confirm('Apakah Anda yakin ingin membatalkan reservasi ini?')) return;

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Silakan login terlebih dahulu');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/reservations/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal membatalkan reservasi');
      }

      if (result.success) {
        toast.success('Reservasi berhasil dibatalkan');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error('Gagal membatalkan reservasi', {
        description: error.message
      });
    }
  };

  // Get countdown color based on time remaining
  const getCountdownColor = () => {
    if (countdown > 600) return 'text-green-600';
    if (countdown > 300) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCountdownBgColor = () => {
    if (countdown > 600) return 'bg-green-50 border-green-200';
    if (countdown > 300) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data reservasi...</p>
          <p className="text-sm text-gray-500 mt-2">Mengambil data dari server</p>
        </div>
      </div>
    );
  }

  if (fetchError && !reservationData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center p-8">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Data</h2>
          <p className="text-gray-600 mb-6">{fetchError}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={fetchReservationData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
            <Link href="/dashboard">
              <Button variant="outline">
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900">Reservasi Parkir</h1>
              <p className="text-sm text-gray-500">Detail reservasi parkir Anda</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {!isExpired && (
              <div className={`px-3 py-1 rounded-full border ${getCountdownBgColor()}`}>
                <div className="flex items-center gap-2">
                  <Clock className={`h-4 w-4 ${getCountdownColor()}`} />
                  <span className={`font-bold ${getCountdownColor()}`}>
                    {formatCountdown(countdown)}
                  </span>
                </div>
              </div>
            )}
            
            <Button
              onClick={fetchReservationData}
              size="sm"
              variant="outline"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Refresh'
              )}
            </Button>
            
            <Link href="/dashboard">
              <Button 
                size="sm" 
                variant="outline" 
                className="hidden sm:flex gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Success Message dengan Countdown */}
        <div className="mb-8">
          <Card className={`${isExpired ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg">
                  {isExpired ? (
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  ) : (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {isExpired ? 'QR Code Kadaluarsa!' : 'Reservasi Berhasil!'}
                      </h3>
                      <p className="text-gray-600">
                        {isExpired 
                          ? 'QR Code telah kadaluarsa. Silakan buat reservasi baru.'
                          : 'Reservasi parkir Anda telah berhasil dibuat. Tunjukkan QR Code berikut saat masuk area parkir.'}
                      </p>
                    </div>
                    
                    {!isExpired && (
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getCountdownColor()}`}>
                          {formatCountdown(countdown)}
                        </div>
                        <p className="text-sm text-gray-500">Waktu tersisa</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="bg-white text-green-700 border-green-300">
                      Kode: {reservationData?.reservation_code}
                    </Badge>
                    <Badge variant="outline" className={`bg-white ${
                      isExpired 
                        ? 'text-red-700 border-red-300' 
                        : 'text-blue-700 border-blue-300'
                    }`}>
                      Status: {isExpired ? 'Kadaluarsa' : 'Aktif'}
                    </Badge>
                    {!isExpired && (
                      <Badge variant="outline" className={`${getCountdownBgColor()} ${getCountdownColor()} border-current`}>
                        ⏱️ Berlaku: {formatCountdown(countdown)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Kiri: QR Code dan Info Reservasi */}
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code Reservasi
                </CardTitle>
                {!isExpired && (
                  <div className={`px-3 py-1 rounded-full ${getCountdownBgColor()}`}>
                    <span className={`text-sm font-bold ${getCountdownColor()}`}>
                      {formatCountdown(countdown)}
                    </span>
                  </div>
                )}
              </div>
              <CardDescription>
                {isExpired 
                  ? 'QR Code telah kadaluarsa. Silakan buat reservasi baru.'
                  : 'Tunjukkan QR Code ini saat masuk area parkir'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* QR Code Display dari Laravel */}
                <div className="flex flex-col items-center">
                  <div className={`w-64 h-64 border-4 rounded-lg flex items-center justify-center mb-4 p-4 ${
                    isExpired 
                      ? 'bg-gray-100 border-gray-300' 
                      : 'bg-white border-gray-200'
                  }`}>
                    {qrCodeImage ? (
                      <div className="relative w-56 h-56">
                        <Image
                          src={qrCodeImage}
                          alt={`QR Code Reservasi ${reservationData?.reservation_code}`}
                          fill
                          className="object-contain"
                          unoptimized
                          onError={(e) => {
                            console.error('Error loading QR code image:', qrCodeImage);
                            (e.target as HTMLImageElement).style.display = 'none';
                            // Fallback ke placeholder
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="text-center">
                                  <div class="grid grid-cols-10 gap-1 p-4">
                                    ${Array.from({ length: 100 }).map((_, i) => `
                                      <div class="w-4 h-4 rounded ${Math.random() > 0.5 ? 'bg-blue-900' : 'bg-transparent'}"></div>
                                    `).join('')}
                                  </div>
                                  <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                      <Building class="h-6 w-6 text-blue-600" />
                                    </div>
                                  </div>
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Memuat QR Code...</p>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 text-center mb-2">
                    Kode: {reservationData?.reservation_code}
                  </p>
                  {isExpired ? (
                    <p className="text-sm text-red-600 font-semibold">
                      ⚠️ QR Code telah kadaluarsa
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 text-center">
                      QR Code dari server • Berlaku {formatCountdown(countdown)} menit lagi
                    </p>
                  )}
                </div>

                {/* QR Code Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={handleDownloadQR}
                    className="w-full"
                    variant="outline"
                    disabled={isExpired || !qrCodeImage}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isExpired ? 'Tidak Tersedia' : 'Unduh QR Code'}
                  </Button>
                  <Button 
                    onClick={handleShare}
                    className="w-full"
                    variant="outline"
                    disabled={isExpired}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {isExpired ? 'Tidak Tersedia' : 'Bagikan'}
                  </Button>
                </div>

                {/* Refresh QR Code Button */}
                {!isExpired && countdown < 600 && reservationData?.status === 'active' && (
                  <Button
                    onClick={handleRefreshQR}
                    variant="outline"
                    className="w-full"
                    disabled={refreshing || isExpired}
                  >
                    {refreshing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Memperbarui...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Perbarui QR Code
                      </>
                    )}
                  </Button>
                )}

                {/* Important Notes */}
                <div className={`p-4 border rounded-lg ${
                  isExpired
                    ? 'bg-red-50 border-red-200'
                    : countdown < 300
                    ? 'bg-red-50 border-red-200'
                    : 'bg-amber-50 border-amber-200'
                }`}>
                  <h4 className="font-semibold mb-2 flex items-center gap-2 ${
                    isExpired || countdown < 300 ? 'text-red-800' : 'text-amber-800'
                  }">
                    <Shield className="h-4 w-4" />
                    {isExpired ? 'QR Code Kadaluarsa' : 'Catatan Penting'}
                  </h4>
                  <ul className={`text-sm space-y-1 ${
                    isExpired || countdown < 300 ? 'text-red-700' : 'text-amber-700'
                  }`}>
                    {isExpired ? (
                      <>
                        <li>• QR Code telah kadaluarsa setelah 15 menit</li>
                        <li>• Silakan buat reservasi baru untuk mendapatkan QR Code baru</li>
                        <li>• QR Code yang sudah kadaluarsa tidak dapat digunakan</li>
                      </>
                    ) : countdown < 300 ? (
                      <>
                        <li>• ⚠️ Waktu QR Code hampir habis! ({formatCountdown(countdown)})</li>
                        <li>• Tunjukkan QR Code saat masuk area parkir sebelum waktu habis</li>
                        <li>• QR Code berlaku 15 menit setelah reservasi</li>
                        <li>• QR Code di-generate oleh server Laravel</li>
                      </>
                    ) : (
                      <>
                        <li>• Tunjukkan QR Code saat masuk area parkir</li>
                        <li>• QR Code berlaku 15 menit setelah reservasi</li>
                        <li>• QR Code di-generate oleh server Laravel</li>
                        <li>• Simpan QR Code untuk pemeriksaan</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                  {!isExpired && reservationData?.status === 'active' && (
                    <Button 
                      onClick={handleCancelReservation}
                      variant="outline"
                      className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                    >
                      Batalkan Reservasi
                    </Button>
                  )}
                  
                  <Link href="/booking" className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      {isExpired ? 'Buat Reservasi Baru' : 'Reservasi Baru'}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kanan: Detail Reservasi */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Detail Reservasi
              </CardTitle>
              <CardDescription>
                Informasi lengkap reservasi parkir Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Status dan Countdown Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Status Reservasi</h3>
                  <div className={`p-4 border rounded-lg ${
                    isExpired
                      ? 'border-red-200 bg-red-50'
                      : 'border-green-200 bg-green-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          {isExpired ? (
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${
                            isExpired ? 'text-red-800' : 'text-green-800'
                          }`}>
                            {isExpired ? 'Kadaluarsa' : 'Aktif'}
                          </p>
                          <p className={`text-sm ${
                            isExpired ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {isExpired 
                              ? 'Reservasi telah kadaluarsa'
                              : `QR Code berlaku ${formatCountdown(countdown)} menit lagi`}
                          </p>
                        </div>
                      </div>
                      <Badge className={
                        isExpired
                          ? 'bg-red-100 text-red-800 hover:bg-red-100'
                          : 'bg-green-100 text-green-800 hover:bg-green-100'
                      }>
                        {reservationData?.status === 'active' ? 'Aktif' : 
                         reservationData?.status === 'expired' ? 'Kadaluarsa' :
                         reservationData?.status === 'cancelled' ? 'Dibatalkan' :
                         reservationData?.status === 'completed' ? 'Selesai' : 'Dipakai'}
                      </Badge>
                    </div>
                    
                    {/* Progress Bar untuk Countdown */}
                    {!isExpired && reservationData?.status === 'active' && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Waktu tersisa:</span>
                          <span>{formatCountdown(countdown)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              countdown > 600 
                                ? 'bg-green-500' 
                                : countdown > 300 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${(countdown / 900) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0 menit</span>
                          <span>15 menit</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lokasi Parkir */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Lokasi Parkir</h3>
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        {reservationData?.parking_lot?.type === 'motor' ? '🏍️' : 
                         reservationData?.parking_lot?.type === 'mobil' ? '🚗' : '🚲'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{reservationData?.parking_lot?.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{reservationData?.parking_lot?.address}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {reservationData?.parking_lot?.type === 'motor' ? 'Sepeda Motor' : 
                             reservationData?.parking_lot?.type === 'mobil' ? 'Mobil' : 'Sepeda'}
                          </Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {reservationData?.parking_lot?.category}
                          </Badge>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            GRATIS
                          </Badge>
                        </div>
                        
                        <div className="mt-3 p-2 bg-amber-50 rounded border border-amber-200">
                          <p className="text-xs font-semibold text-amber-800">
                            ⚠️ Akses Gerbang: {reservationData?.parking_lot?.gate_access}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Kendaraan */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Info Kendaraan</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-gray-200 rounded-lg bg-white">
                      <p className="text-xs text-gray-500">Jenis Kendaraan</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Car className="h-4 w-4 text-gray-600" />
                        <p className="font-medium">
                          {reservationData?.vehicle_type === 'motor' ? 'Sepeda Motor' : 'Mobil'}
                        </p>
                      </div>
                    </div>
                    <div className="p-3 border border-gray-200 rounded-lg bg-white">
                      <p className="text-xs text-gray-500">Nomor Kendaraan</p>
                      <p className="font-medium text-lg tracking-wider mt-1">
                        {reservationData?.vehicle_number}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Waktu Reservasi */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Waktu Reservasi</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-gray-200 rounded-lg bg-white">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <p className="text-xs text-gray-500">Dibuat</p>
                      </div>
                      <p className="font-medium mt-1">
                        {reservationData?.reservation_time ? 
                          format(new Date(reservationData.reservation_time), 'dd MMM yyyy', { locale: id }) : 
                          'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {reservationData?.reservation_time ? 
                          format(new Date(reservationData.reservation_time), 'HH:mm', { locale: id }) : 
                          'N/A'}
                      </p>
                    </div>
                    <div className="p-3 border border-gray-200 rounded-lg bg-white">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <p className="text-xs text-gray-500">Kadaluarsa</p>
                      </div>
                      <p className="font-medium mt-1">
                        {reservationData?.expiry_time ? 
                          format(new Date(reservationData.expiry_time), 'dd MMM yyyy', { locale: id }) : 
                          'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {reservationData?.expiry_time ? 
                          format(new Date(reservationData.expiry_time), 'HH:mm', { locale: id }) : 
                          'N/A'}
                      </p>
                      {!isExpired && reservationData?.status === 'active' && (
                        <p className="text-xs text-blue-600 font-semibold mt-1">
                          ⏱️ {formatCountdown(countdown)} menit lagi
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Durasi Estimasi */}
                {reservationData?.estimated_duration && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Durasi Estimasi</h3>
                    <div className="p-3 border border-gray-200 rounded-lg bg-white">
                      <p className="text-sm text-gray-600">
                        Anda memperkirakan akan parkir selama{' '}
                        <span className="font-semibold text-blue-600">
                          {Math.floor(reservationData.estimated_duration / 60)} jam{' '}
                          {reservationData.estimated_duration % 60} menit
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Link href="/dashboard" className="w-full">
                      <Button variant="outline" className="w-full">
                        Lihat Semua Reservasi
                      </Button>
                    </Link>
                    <Button
                      onClick={fetchReservationData}
                      variant="outline"
                      className="w-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className={`bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 ${
          isExpired ? 'opacity-50' : ''
        }`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-lg">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">Peraturan Penggunaan Parkir</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">1. Batas Waktu QR Code:</span> QR Code berlaku 15 menit setelah reservasi
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">2. Sumber QR Code:</span> QR Code di-generate oleh server Laravel
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">3. Countdown Timer:</span> Perhatikan timer countdown di atas QR Code
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">4. Keamanan:</span> Jaga QR Code Anda dan jangan bagikan ke orang lain
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">5. Refresh QR Code:</span> Dapat memperbarui QR Code sebelum waktu habis
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">6. Bantuan:</span> Hubungi security kampus jika mengalami masalah
                    </p>
                  </div>
                </div>
                
                {!isExpired && countdown < 300 && reservationData?.status === 'active' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 font-semibold">
                      ⚠️ Peringatan: QR Code Anda akan kadaluarsa dalam {formatCountdown(countdown)} menit!
                      Segera gunakan QR Code untuk masuk area parkir.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}