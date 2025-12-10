const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RevealResponse {
  friendName: string;
}

interface StatusResponse {
  hasAssignment: boolean;
  friendName?: string;
}

interface AuthResponse {
  token: string;
  user: {
    rollNumber: string;
    name: string;
  };
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const registerUser = async (token: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }
  
  return response.json();
};

export const loginUser = async (rollNumber: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rollNumber })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  
  return response.json();
};

export const revealFriend = async (): Promise<RevealResponse> => {
  const response = await fetch(`${API_URL}/reveal`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to reveal friend');
  }
  
  return response.json();
};

export const getStatus = async (): Promise<StatusResponse> => {
  const response = await fetch(`${API_URL}/status`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Failed to get status');
  }
  
  return response.json();
};

export const getStudents = async () => {
  const response = await fetch(`${API_URL}/students`);
  
  if (!response.ok) {
    throw new Error('Failed to get students');
  }
  
  return response.json();
};