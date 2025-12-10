'use client';

import { useState } from 'react';

interface RegistrationProps {
  onSuccess: (token: string, user: any) => void;
  onError: (error: string) => void;
}

export default function Registration({ onSuccess, onError }: RegistrationProps) {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email })
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
      <div className="text-6xl mb-6">🎄</div>
      <h1 className="text-3xl font-bold text-green-700 mb-4">Christmas Friend Registration</h1>
      <p className="text-gray-600 mb-8">Enter your signup token and email to register</p>
      
      <form onSubmit={handleRegister} className="max-w-md mx-auto space-y-4">
        <input
          type="text"
          placeholder="Signup Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}