import axios from './axiosInstance'; 
import { variables } from '../Variables';

export const refreshToken = async () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!token || !refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(`${variables.TOKEN_API_URL}/refresh-token`, {
        token,
        refreshToken
    });

    const { token: newToken, refreshToken: newRefreshToken } = response.data;

    if (!newToken || !newRefreshToken) {
        throw new Error('Invalid response from server');
    }

    // Store new tokens
    localStorage.setItem('token', newToken);
    localStorage.setItem('refreshToken', newRefreshToken);
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
};