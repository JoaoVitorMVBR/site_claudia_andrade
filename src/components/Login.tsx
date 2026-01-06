'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'senha123';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('isAdminLoggedIn', 'true');
      router.push('/admin/upload');
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="font-[Poppins-light] text-2xl font-bold text-gray-800 text-center mb-6">
          Login do Administrador
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="font-[Poppins-light] block text-sm font-medium text-gray-700"
            >
              Usuário/Email
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="font-[Poppins-light] block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            className="font-[Poppins-light] w-full bg-[#ffffff] text-white py-2 px-4 rounded-md hover:bg-[#cc936b] transition-colors duration-300"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;