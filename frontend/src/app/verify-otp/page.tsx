'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function VerifyOtpPage() {
  const { verifyOtp, resendOtp, user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [resending, setResending] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect jika sudah login
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const otpIdentifier = localStorage.getItem('otp_identifier');
  
    if (token && !otpIdentifier) {
      router.replace('/dashboard');
    }
  }, [router]);

  // Countdown resend OTP
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // Auto check OTP identifier on mount
  useEffect(() => {
    const otpIdentifier = localStorage.getItem('otp_identifier');
    if (!otpIdentifier) {
      toast.error('Session expired. Please register/login again.');
      router.push('/register');
    }
  }, [router]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
  
    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);
  
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  
    // Auto submit
    if (value && index === 5) {
      handleAutoSubmit(updated);
    }
  };

  const handleAutoSubmit = async (digits: string[]) => {
    const code = digits.join('');
    if (code.length !== 6 || loading) return;
  
    try {
      setLoading(true);
      await verifyOtp(code);
    } catch {
      // Error sudah ditangani
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const code = otpDigits.join('');
    if (code.length !== 6) {
      toast.error('Kode OTP harus lengkap (6 digit)');
      return;
    }

    try {
      setLoading(true);
      await verifyOtp(code);
    } catch {
      // Error sudah ditangani
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await resendOtp();
      setCooldown(60);
      setOtpDigits(Array(6).fill(''));
      inputRefs.current[0]?.focus();
      toast.success('OTP baru telah dikirim');
    } catch {
      // Error sudah ditangani
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-green-50 px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Verifikasi OTP</h1>
          <p className="text-gray-600 mt-2">
            Masukkan kode 6 digit yang dikirim ke email Anda
          </p>
        </div>

        <div className="mb-6 flex justify-center gap-2">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="h-14 w-14 rounded-lg border-2 border-gray-300 text-center text-2xl font-bold focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              disabled={loading}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otpDigits.join('').length !== 6}
          className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
              Memverifikasi...
            </span>
          ) : (
            'Verifikasi OTP'
          )}
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          {cooldown > 0 ? (
            <p>
              Kirim ulang OTP dalam{' '}
              <span className="font-semibold">{cooldown}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="font-medium text-blue-600 hover:text-blue-800 hover:underline disabled:opacity-50"
            >
              {resending ? 'Mengirim...' : 'Kirim ulang OTP'}
            </button>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/register')}
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            ← Kembali ke registrasi
          </button>
        </div>
      </div>
    </div>
  );
}