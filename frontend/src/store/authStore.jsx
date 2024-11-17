import { create } from 'zustand';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BE_URL}/auth/login`;

const useAuthStore = create((set) => ({
  token: null,
  error: null,
  isLoggedIn: false, // Login işleminin yapıldığını kontrol eden state

  login: async (email, password) => {
    try {
      const response = await axios.post(API_URL, { email, password }, {
        withCredentials: true, // Backend'in token'ı cookie'de set etmesine izin ver
      });
      
      const token = response.data.token;
      
      // Token'ı cookie'de sakla
      document.cookie = `token=${token}; path=/; max-age=3600`; // 1 saat geçerli

      set({ token, error: null, isLoggedIn: true });

      // Redirect to manage-packages
    } catch (error) {
      set({ error: 'Invalid credentials' });
      throw error;
    }
  },

  logout: () => {
    // Token'ı cookie'den silmek için
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    set({ token: null, error: null, isLoggedIn: false });
  },

  // Token'ı cookie'den alacak fonksiyon
  getTokenFromCookie: () => {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }
}));

export default useAuthStore;