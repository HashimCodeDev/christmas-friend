'use client';

import { useState, useEffect } from 'react';
import { revealFriend, getStatus, getStudents } from '../lib/api';

interface Student {
  id: number;
  name: string;
}

export default function ChristmasFriendSelector() {
  const [friendName, setFriendName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedStudentId');
      return stored ? Number(stored) : null;
    }
    return null;
  });
  const [hasRevealed, setHasRevealed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hasRevealed') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const studentsData = await getStudents();
        setStudents(studentsData);
        if (typeof window !== 'undefined') {
          localStorage.setItem('message', 'why make my life harder than it already is');
        }
      } catch (err) {
        console.error('Failed to load students:', err);
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      const checkStatus = async () => {
        try {
          const status = await getStatus(selectedStudentId);
          if (status.hasAssignment) {
            setFriendName(status.friendName || null);
          } else {
            setFriendName(null);
          }
        } catch (err) {
          console.error('Failed to check status:', err);
        }
      };

      checkStatus();
    }
  }, [selectedStudentId]);

  const handleReveal = async () => {
    if (!selectedStudentId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await revealFriend(selectedStudentId);
      setFriendName(result.friendName);
      setHasRevealed(true);
      localStorage.setItem('hasRevealed', 'true');
      localStorage.setItem('selectedStudentId', selectedStudentId.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading...</p>
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
        <p className="text-gray-600 text-lg font-medium">
          Time to spread some Christmas joy!
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-6">
      <div className="mb-8">
        <div className="text-6xl mb-4">🎁</div>
        <p className="text-gray-600 text-lg mb-6">
          Select your name and discover your Secret Santa assignment!
        </p>

        <select
          value={selectedStudentId || ''}
          onChange={(e) => {
            if (!hasRevealed) {
              setSelectedStudentId(Number(e.target.value));
            }
          }}
          disabled={hasRevealed}
          className={`w-full p-3 border-2 rounded-lg text-lg mb-6 focus:outline-none ${hasRevealed
              ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'border-gray-300 focus:border-green-500'
            }`}
        >
          <option value="">{hasRevealed ? 'Selection locked' : 'Choose your name...'}</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleReveal}
        disabled={loading || !selectedStudentId}
        className="w-full bg-linear-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg"
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

      {error && (
        <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <p className="text-red-700 font-medium">❌ {error}</p>
        </div>
      )}
    </div>
  );
}