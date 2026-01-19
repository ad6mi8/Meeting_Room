/**
 * API utility functions
 * Handles all HTTP requests to the backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const api = {
  // Authentication
  sendOTP: async (email) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    return response.json();
  },

  verifyOTP: async (email, otp) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, otp })
    });
    return response.json();
  },

  // Meetings
  createMeeting: async () => {
    const response = await fetch(`${API_BASE_URL}/api/meetings/create`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  joinMeeting: async (meetingId, password) => {
    const response = await fetch(`${API_BASE_URL}/api/meetings/join`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ meetingId, password })
    });
    return response.json();
  }
};
