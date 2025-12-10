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
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };
    
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
        localStorage.setItem('adminToken', token);
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
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
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button
          onClick={() => { localStorage.removeItem('adminToken'); setIsLoggedIn(false); }}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="font-bold">Total Users</h3>
          <p className="text-2xl">{stats.totalUsers}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="font-bold">Registered</h3>
          <p className="text-2xl">{stats.registeredUsers}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="font-bold">Matched</h3>
          <p className="text-2xl">{stats.matchedUsers}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Generate Tokens</h2>
        <textarea
          placeholder="Enter students (one per line): RollNumber, Name"
          value={newStudents}
          onChange={(e) => setNewStudents(e.target.value)}
          className="w-full p-3 border rounded mb-4 h-32"
        />
        <button
          onClick={generateTokens}
          className="bg-green-600 text-white px-4 py-2 rounded mr-4"
        >
          Generate Tokens
        </button>
        {tokens.length > 0 && (
          <button
            onClick={exportCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Export CSV
          </button>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Roll Number</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Registered</th>
                <th className="border p-2">Token Used</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="border p-2">{user.rollNumber}</td>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.isRegistered ? '✅' : '❌'}</td>
                  <td className="border p-2">{user.SignupToken?.used ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}