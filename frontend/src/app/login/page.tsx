'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // ✅ IMPORT AUTHCONTEXT
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Eye,
  EyeOff,
  LogIn,
  ParkingCircle,
  Lock,
  User,
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // ✅ GUNAKAN AUTHCONTEXT

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.identifier.trim() || !formData.password.trim()) {
      toast.error('Username/email dan kata sandi wajib diisi');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 [LOGIN] Login attempt started');
      
      // ✅ GUNAKAN LOGIN FUNCTION DARI AUTHCONTEXT
      await login(formData.identifier, formData.password);
      
      console.log('✅ [LOGIN] Login function completed');
      
      // ✅ REDIRECT SUDAU DIHANDLE OLEH AUTHCONTEXT
      // TIDAK PERLU router.push() DI SINI
      
    } catch (err: any) {
      console.error('❌ [LOGIN] Login error:', err);
      
      // Error sudah ditangani di AuthContext, tapi kita tampilkan toast tambahan
      if (err.message && !err.message.includes('Login gagal')) {
        toast.error(`❌ ${err.message}`);
      }
      
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/api/auth/google/redirect';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
            <ParkingCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Selamat Datang Kembali
          </h1>
          <p className="text-gray-600 mt-2">
            Masuk ke akun Parkirin Aja
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              Masuk
            </CardTitle>
            <CardDescription className="text-center">
              Gunakan akun Parkirin Aja atau Google
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Masuk dengan Google
            </Button>

            <div className="relative">
              <Separator />
              <span className="absolute inset-x-0 -top-2 mx-auto w-fit bg-white px-2 text-xs text-gray-500">
                ATAU
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">
                  Akun Parkirin Aja *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Username atau email"
                    value={formData.identifier}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        identifier: e.target.value,
                      })
                    }
                    className="pl-10 h-11"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    className="pl-10 pr-10 h-11"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(v) =>
                    setRememberMe(Boolean(v))
                  }
                  disabled={loading}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal"
                >
                  Ingat saya
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Masuk
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t pt-6">
            <p className="text-sm text-gray-600 text-center">
              Belum punya akun?{' '}
              <Link
                href="/register"
                className="text-blue-600 hover:underline"
              >
                Daftar
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}