'use client';

import { useState, useEffect } from 'react';
import { revealFriend, getStatus, loginUser } from '../lib/api';
import Registration from './Registration';

interface User {
  rollNumber: string;
  name: string;
}

export default function ChristmasFriendSelector() {
  const [user, setUser] = useState<User | null>(null);
  const [friendName, setFriendName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
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
    setUser(userData);
    await checkStatus();
  };

  const handleLogin = async (rollNumber: string) => {
    try {
      const authData = await loginUser(rollNumber);
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
    setUser(null);
    setFriendName(null);
    setError(null);
  };

  if (initialLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
        <p className="text-gray-500 mt-6 text-lg font-medium">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-6">
        <Registration onSuccess={handleRegistrationSuccess} onError={setError} />
        {error && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
            <p className="text-red-700 font-medium flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              {error}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (friendName) {
    return (
      <div className="text-center py-6">
        <div className="bg-linear-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-8 mb-6 shadow-lg">
          <div className="text-7xl mb-6 animate-bounce">🎁</div>
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">
            Your Christmas Friend is:
          </h2>
          <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
            <p className="text-4xl font-bold bg-linear-to-r from-red-600 to-emerald-600 bg-clip-text text-transparent">
              {friendName}
            </p>
          </div>
          <div className="flex justify-center space-x-3 text-3xl">
            <span className="animate-pulse">🎄</span>
            <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>✨</span>
            <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>🎅</span>
            <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>✨</span>
            <span className="animate-pulse">🎄</span>
          </div>
        </div>
        <p className="text-gray-700 text-lg font-semibold mb-6">
          Time to spread some Christmas joy! 🎉
        </p>
        <button
          onClick={handleSignOut}
          className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
        >
          Sign out →
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-6">
      <div className="mb-10">
        <div className="text-7xl mb-6">🎁</div>
        <h2 className="text-3xl font-bold text-emerald-800 mb-3">
          Welcome, {user.name}!
        </h2>
        <p className="text-gray-600 text-lg">
          Ready to discover your Secret Santa assignment?
        </p>
      </div>

      <button
        onClick={handleReveal}
        disabled={loading}
        className="w-full bg-linear-to-r from-red-500 to-emerald-600 hover:from-red-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-8 rounded-xl text-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:scale-100 shadow-lg mb-6"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3"></div>
            Revealing...
          </div>
        ) : (
          <span className="flex items-center justify-center">
            <span className="text-2xl mr-2">🎄</span>
            Reveal My Christmas Friend
            <span className="text-2xl ml-2">🎄</span>
          </span>
        )}
      </button>

      <button
        onClick={handleSignOut}
        className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
      >
        Sign out →
      </button>

      {error && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
          <p className="text-red-700 font-medium flex items-center justify-center">
            <span className="text-xl mr-2">⚠️</span>
            {error}
          </p>
        </div>
      )}
    </div>
  );
}