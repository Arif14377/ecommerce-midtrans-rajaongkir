import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useLogin } from '../../hooks/auth/useLogin';
import type { ApiError } from '../../types/api';
import Input from '../../components/general/Input';
import Button from '../../components/general/Button';

interface ValidationErrors {
  email?: string;
  password?: string;
  Error?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const { mutate: login, isPending: isLoading } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    login({ email, password }, {
      onSuccess: () => {
        navigate('/', { replace: true });
      },
      onError: (error: ApiError) => {
        setErrors(error.response?.data?.errors as ValidationErrors || { Error: 'Terjadi kesalahan' });
      }
    });
  };

  return (
    <div className="min-h-screen flex">
      <title>Login - TokoKita Admin</title>
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-cyan-400 to-cyan-500 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold">TokoKita</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Kelola toko online Anda dengan mudah
          </h1>
          <p className="text-white/80 text-lg">
            Dashboard lengkap untuk mengelola produk, pesanan, dan pelanggan.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-3 mb-8 w-fit mx-auto cursor-pointer">
            <img src="https://is3.cloudhost.id/kodemastery/tokokita.png" alt="TokoKita Logo" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold text-gray-900">TokoKita</span>
          </Link>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900">Masuk ke Akun</h2>
              <p className="text-gray-500 mt-1 text-sm">Selamat datang kembali</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                disabled={isLoading}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({});
                }}
                inputClassName="bg-gray-50 form-control"
                placeholder="nama@email.com"
                error={errors.email}
              />

              <Input
                label="Password"
                type="password"
                value={password}
                disabled={isLoading}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({});
                }}
                inputClassName="bg-gray-50 form-control"
                placeholder="Masukkan password"
                error={errors.password}
              />

              {errors.Error && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs text-red-600">
                  Email atau password salah
                </div>
              )}

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full bg-linear-to-br from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600"
              >
                Masuk
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Belum punya akun?{' '}
            <Link to="/register" className="text-cyan-600 font-medium">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;