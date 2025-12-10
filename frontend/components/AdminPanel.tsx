'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  rollNumber: string;
  name: string;
  isRegistered: boolean;
  SignupToken?: { token: string; used: boolean };
}

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, registeredUsers: 0, matchedUsers: 0 });
  const [newStudents, setNewStudents] = useState('');
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
  }, []);

  const fetchData = async () => {
    const headers = {};
    
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/users`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/stats`, { headers })
      ]);
      
      setUsers(await usersRes.json());
      setStats(await statsRes.json());
    } catch (error) {
      console.error('Failed to fetch data');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        const { token } = await response.json();
        setIsLoggedIn(true);
        fetchData();
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  const generateTokens = async () => {
    const students = newStudents.split('\n').map(line => {
      const [rollNumber, name] = line.split(',').map(s => s.trim());
      return { rollNumber, name };
    }).filter(s => s.rollNumber && s.name);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/generate-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ students })
      });
      
      const { tokens } = await response.json();
      setTokens(tokens);
      fetchData();
    } catch (error) {
      alert('Failed to generate tokens');
    }
  };

  const exportCSV = () => {
    const csv = 'Roll Number,Name,Token\n' + 
      tokens.map(t => `${t.rollNumber},${t.name},${t.token}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signup-tokens.csv';
    a.click();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Login</h1>
            <p className="text-slate-600">Access the control panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-slate-900 placeholder-slate-400 bg-white"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-slate-900 placeholder-slate-400 bg-white"
              required
            />
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg">
              Login →
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">🎄 Admin Panel</h1>
              <p className="text-slate-600">Manage Christmas Friend assignments</p>
            </div>
            <button
              onClick={() => { setIsLoggedIn(false); }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Logout →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-100 font-semibold mb-1">Total Users</h3>
                <p className="text-4xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="text-5xl opacity-20">👥</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-emerald-100 font-semibold mb-1">Registered</h3>
                <p className="text-4xl font-bold">{stats.registeredUsers}</p>
              </div>
              <div className="text-5xl opacity-20">✅</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-amber-100 font-semibold mb-1">Matched</h3>
                <p className="text-4xl font-bold">{stats.matchedUsers}</p>
              </div>
              <div className="text-5xl opacity-20">🎁</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">🎫</span>
            Generate Tokens
          </h2>
          <textarea
            placeholder="Enter students (one per line): RollNumber, Name"
            value={newStudents}
            onChange={(e) => setNewStudents(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-slate-900 placeholder-slate-400 bg-white h-32 mb-4 font-mono"
          />
          <div className="flex gap-3">
            <button
              onClick={generateTokens}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Generate Tokens
            </button>
            {tokens.length > 0 && (
              <button
                onClick={exportCSV}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                📥 Export CSV
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">📋</span>
            Users List
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-200">
                  <th className="text-left p-4 font-semibold text-slate-700">Roll Number</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Name</th>
                  <th className="text-center p-4 font-semibold text-slate-700">Registered</th>
                  <th className="text-center p-4 font-semibold text-slate-700">Token Used</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-800 font-medium">{user.rollNumber}</td>
                    <td className="p-4 text-slate-800">{user.name}</td>
                    <td className="p-4 text-center text-2xl">{user.isRegistered ? '✅' : '❌'}</td>
                    <td className="p-4 text-center text-2xl">{user.SignupToken?.used ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}