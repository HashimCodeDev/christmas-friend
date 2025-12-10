'use client';

import { useState } from 'react';

interface RegistrationProps {
  onSuccess: (token: string, user: any) => void;
  onError: (error: string) => void;
}

export default function Registration({ onSuccess, onError }: RegistrationProps) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const data = await response.json();
      onSuccess(data.token, data.user);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center py-6">
      <div className="text-7xl mb-6">🎄</div>
      <h1 className="text-3xl font-bold text-emerald-800 mb-3">Christmas Friend Registration</h1>
      <p className="text-gray-600 mb-8">Enter your signup token to register</p>

      <form onSubmit={handleRegister} className="space-y-5">
        <input
          type="text"
          placeholder="Signup Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all text-gray-900 placeholder-gray-400 bg-white"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-red-500 to-emerald-600 hover:from-red-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:scale-100 shadow-md"
        >
          {loading ? 'Registering...' : 'Register →'}
        </button>
      </form>
    </div>
  );
}