const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RevealResponse {
  friendName: string;
}

interface StatusResponse {
  hasAssignment: boolean;
  friendName?: string;
}

export const revealFriend = async (studentId: number): Promise<RevealResponse> => {
  const response = await fetch(`${API_URL}/reveal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to reveal friend');
  }
  
  return response.json();
};

export const getStatus = async (studentId: number): Promise<StatusResponse> => {
  const response = await fetch(`${API_URL}/status/${studentId}`);
  
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