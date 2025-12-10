'use client';

import { useState, useEffect } from 'react';
import { revealFriend, getStatus, loginUser } from '../lib/api';
import Registration from './Registration';

interface User {
  email: string;
  name: string;
}

export default function ChristmasFriendSelector() {
  const [user, setUser] = useState<User | null>(null);
  const [friendName, setFriendName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      checkStatus();
    }
    setInitialLoading(false);
  }, []);

  const checkStatus = async () => {
    try {
      const status = await getStatus();
      if (status.hasAssignment) {
        setFriendName(status.friendName || null);
      }
    } catch (err) {
      console.error('Failed to check status:', err);
    }
  };

  const handleRegistrationSuccess = async (token: string, userData: any) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    await checkStatus();
  };

  const handleLogin = async (email: string) => {
    try {
      const authData = await loginUser(email);
      localStorage.setItem('authToken', authData.token);
      localStorage.setItem('userData', JSON.stringify(authData.user));
      setUser(authData.user);
      await checkStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleReveal = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await revealFriend();
      setFriendName(result.friendName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setFriendName(null);
    setError(null);
  };

  if (initialLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-6">
        <Registration onSuccess={handleRegistrationSuccess} onError={setError} />
        <div className="mt-6">
          <p className="text-gray-600 mb-4">Already registered?</p>
          <input
            type="email"
            placeholder="Enter your email to login"
            className="p-2 border rounded mr-2"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleLogin((e.target as HTMLInputElement).value);
              }
            }}
          />
        </div>
        {error && (
          <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-red-700 font-medium">❌ {error}</p>
          </div>
        )}
      </div>
    );
  }

  if (friendName) {
    return (
      <div className="text-center py-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Your Christmas Friend is:
          </h2>
          <p className="text-3xl font-bold text-red-600 mb-4">{friendName}</p>
          <div className="flex justify-center space-x-2 text-2xl">
            <span>🎄</span>
            <span>✨</span>
            <span>🎅</span>
            <span>✨</span>
            <span>🎄</span>
          </div>
        </div>
        <p className="text-gray-600 text-lg font-medium mb-4">
          Time to spread some Christmas joy!
        </p>
        <button
          onClick={handleSignOut}
          className="text-gray-500 hover:text-gray-700 underline"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-6">
      <div className="mb-8">
        <div className="text-6xl mb-4">🎁</div>
        <h2 className="text-2xl font-bold text-green-700 mb-2">
          Welcome, {user.name}!
        </h2>
        <p className="text-gray-600 text-lg mb-6">
          Ready to discover your Secret Santa assignment?
        </p>
      </div>

      <button
        onClick={handleReveal}
        disabled={loading}
        className="w-full bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg mb-4"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
            Revealing...
          </div>
        ) : (
          '🎄 Reveal My Christmas Friend 🎄'
        )}
      </button>

      <button
        onClick={handleSignOut}
        className="text-gray-500 hover:text-gray-700 underline"
      >
        Sign out
      </button>

      {error && (
        <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <p className="text-red-700 font-medium">❌ {error}</p>
        </div>
      )}
    </div>
  );
}