import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useRegister } from '../../hooks/auth/useRegister';
import type { ApiError } from '../../types/api';
import Input from '../../components/general/Input';
import Button from '../../components/general/Button';

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  Error?: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const { mutate: register, isPending: isLoading } = useRegister();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrors({ password: 'Password konfirmasi tidak cocok' });
      return;
    }

    register(
      { name, email, password },
      {
        onSuccess: () => {
          navigate('/login', { replace: true });
        },
        onError: (error: ApiError) => {
          setErrors(
            error.response?.data?.errors as ValidationErrors || {
              Error: 'Terjadi kesalahan saat registrasi',
            }
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex">
      <title>Register - TokoKita Admin</title>

      {/* Left Section */}
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
          <h1 className="text-4xl font-bold mb-4">Bergabunglah dengan Kami</h1>
          <p className="text-white/80 text-lg">
            Daftar sekarang untuk mulai berbelanja produk favorit Anda.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="flex items-center justify-center gap-3 mb-8 w-fit mx-auto cursor-pointer"
          >
            <img src="https://is3.cloudhost.id/kodemastery/tokokita.png" alt="TokoKita Logo" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold text-gray-900">TokoKita</span>
          </Link>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900">Daftar Akun Baru</h2>
              <p className="text-gray-500 mt-1 text-sm">
                Lengkapi data di bawah ini
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nama Lengkap"
                type="text"
                value={name}
                disabled={isLoading}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors({});
                }}
                placeholder="Nama Lengkap"
                error={errors.name}
              />

              <Input
                label="Email"
                type="email"
                value={email}
                disabled={isLoading}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({});
                }}
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
                placeholder="Masukkan password"
                error={errors.password}
              />

              <Input
                label="Konfirmasi Password"
                type="password"
                value={confirmPassword}
                disabled={isLoading}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors({});
                }}
                placeholder="Ulangi password"
              />

              {errors.Error && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs text-red-600">
                  {errors.Error}
                </div>
              )}

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full bg-linear-to-br from-cyan-400 to-cyan-500"
              >
                Daftar Sekarang
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-cyan-600 font-medium">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;