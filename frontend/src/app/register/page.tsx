'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Eye, EyeOff, UserPlus, ParkingCircle, Check, X, Phone } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirm_password: '',
    phone: '',
  });
  
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  /* =====================
     PASSWORD VALIDATION
  ===================== */
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(formData.password);

  /* =====================
     PHONE NUMBER FORMATTING
  ===================== */
  const formatPhoneNumber = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    if (numbers.length <= 10) return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  /* =====================
     FORM SUBMISSION HANDLER
  ===================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 [REGISTER] Form submission started');

    // 1. VALIDASI FIELD KOSONG
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.confirm_password ||
      !formData.phone
    ) {
      toast.error('❌ Mohon lengkapi semua field');
      return;
    }

    // 2. VALIDASI FORMAT TELEPON
    const cleanPhone = formData.phone.replace(/\D/g, '');
    const phoneRegex = /^\d{10,13}$/;
    if (!phoneRegex.test(cleanPhone)) {
      toast.error('❌ Format nomor telepon tidak valid (10-13 digit)');
      return;
    }

    // 3. VALIDASI KONFIRMASI PASSWORD
    if (formData.password !== formData.confirm_password) {
      toast.error('❌ Password tidak sama');
      return;
    }

    // 4. VALIDASI KEKUATAN PASSWORD
    if (!passwordValidation.isValid) {
      toast.error('❌ Password belum memenuhi syarat keamanan');
      return;
    }

    // 5. VALIDASI TERMS & CONDITIONS
    if (!agreeTerms) {
      toast.error('❌ Anda harus menyetujui Terms & Privacy Policy');
      return;
    }

    // 6. SET LOADING STATE
    setLoading(true);
    console.log('🔄 [REGISTER] Loading state set to true');

    try {
      console.log('📤 [REGISTER] Calling register function from AuthContext...');
      
      // 7. PANGGIL REGISTER FUNCTION
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirm_password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: cleanPhone,
      });

      console.log('✅ [REGISTER] Register function completed successfully');
      
      // TIDAK PERLU REDIRECT MANUAL DI SINI
      // REDIRECT SUDAU DIHANDLE OLEH AUTHCONTEXT

    } catch (error: any) {
      console.error('❌ [REGISTER] Error in register page:', error);
      
      // ERROR SUDAH DIHANDLE OLEH AUTHCONTEXT
      // TAPI KITA TAMPILKAN TOAST TAMBAHAN JIKA PERLU
      
      if (error.message && !error.message.includes('Registration failed')) {
        toast.error(`❌ ${error.message}`);
      }
      
    } finally {
      console.log('🏁 [REGISTER] Form submission completed');
      // NOTE: Loading akan di-set false di AuthContext
      // Jadi kita tidak perlu setLoading(false) di sini
    }
  };

  /* =====================
     INPUT CHANGE HANDLERS
  ===================== */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formattedPhone });
  };

  const handleInputChange = (field: keyof typeof formData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50 p-4">
      <div className="w-full max-w-2xl">
        {/* LOGO & TITLE */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
            <ParkingCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Buat Akun Baru</h1>
          <p className="text-gray-600 mt-2">Daftarkan akun Parkirin Aja Anda</p>
        </div>

        {/* REGISTRATION CARD */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Daftar</CardTitle>
            <CardDescription className="text-center">
              Lengkapi data untuk membuat akun baru
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* PERSONAL INFORMATION */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Informasi Pribadi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-sm font-medium">
                      Nama Depan *
                    </Label>
                    <Input
                      id="first_name"
                      type="text"
                      placeholder="Nama Depan"
                      value={formData.first_name}
                      onChange={handleInputChange('first_name')}
                      className="h-11"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-sm font-medium">
                      Nama Belakang *
                    </Label>
                    <Input
                      id="last_name"
                      type="text"
                      placeholder="Nama Belakang"
                      value={formData.last_name}
                      onChange={handleInputChange('last_name')}
                      className="h-11"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* CONTACT INFORMATION */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Informasi Kontak
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Alamat Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@polibatam.ac.id"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      className="h-11"
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500">
                      Gunakan email Politeknik Negeri Batam jika ada
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Nomor Telepon *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="081-2345-6789"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className="h-11 pl-10"
                        required
                        disabled={loading}
                        maxLength={13}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Format: 081-2345-6789 (10-13 digit)
                    </p>
                  </div>
                </div>
              </div>

              {/* ACCOUNT CREDENTIALS */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Kredensial Akun
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Nama Pengguna *
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="username123"
                      value={formData.username}
                      onChange={handleInputChange('username')}
                      className="h-11"
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500">
                      Gunakan huruf, angka, dash, dan underscore
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Kata Sandi *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password123!"
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        className="h-11 pr-10"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
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
                </div>
                
                {/* CONFIRM PASSWORD */}
                <div className="space-y-2">
                  <Label htmlFor="confirm_password" className="text-sm font-medium">
                    Konfirmasi Kata Sandi *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Password123!"
                      value={formData.confirm_password}
                      onChange={handleInputChange('confirm_password')}
                      className="h-11 pr-10"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* PASSWORD REQUIREMENTS */}
                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  <p className="text-sm font-medium text-gray-700">Syarat Kata Sandi:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      {passwordValidation.minLength ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`text-xs ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                        Minimal 8 karakter
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {passwordValidation.hasUpperCase ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`text-xs ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                        Satu huruf besar
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {passwordValidation.hasLowerCase ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`text-xs ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                        Satu huruf kecil
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {passwordValidation.hasNumbers ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`text-xs ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-gray-500'}`}>
                        Satu angka
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 col-span-2">
                      {passwordValidation.hasSpecialChar ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`text-xs ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                        Satu karakter khusus (!@#$%^&*)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TERMS AND CONDITIONS */}
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                    disabled={loading}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer">
                    Saya menyetujui{' '}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Syarat Layanan
                    </Link>{' '}
                    dan{' '}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      Kebijakan Privasi
                    </Link>
                    . Saya konfirmasi bahwa informasi yang diberikan benar.
                  </Label>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <Button 
                type="submit" 
                className="w-full h-11" 
                size="lg"
                disabled={loading || !agreeTerms || !passwordValidation.isValid}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                    Membuat Akun...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Buat Akun
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          {/* FOOTER LINKS */}
          <CardFooter className="flex flex-col space-y-4 border-t pt-6">
            <div className="text-center text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link 
                href="/login" 
                className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                Login di sini
              </Link>
            </div>
            
            <div className="text-center">
              <Link 
                href="/" 
                className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
              >
                ← Kembali ke beranda
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* SYSTEM FOOTER */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 Politeknik Negeri Batam Parking System. All rights reserved.</p>
          <p className="mt-1 text-xs">Exclusive for Polibatam faculty and students</p>
        </div>
      </div>
    </div>
  );
}