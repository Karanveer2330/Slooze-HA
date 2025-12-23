const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiCall = async (endpoint, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { token }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  return response;
};

export default API_URL;



