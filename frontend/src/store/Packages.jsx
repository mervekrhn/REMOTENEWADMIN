import { create } from 'zustand';
import axios from 'axios';

// Cookie'den token'ı alma fonksiyonu
const getTokenFromCookie = () => {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

const API_URL = `${import.meta.env.VITE_BE_URL}/question-package`;

const usePackageStore = create((set) => ({
  packages: [],
  loading: false,
  error: null,

  // Fetch packages from backend and update state
  fetchPackages: async () => {
    const token = getTokenFromCookie();
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/list`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Token ekleniyor
        },
        withCredentials: true, 
      });
      set({ packages: response.data, error: null });
    } catch (error) {
      console.error("Failed to fetch packages:", error);
      set({ error: 'Paketler getirilemedi.' });
    } finally {
      set({ loading: false });
    }
  },

  // Add new package and update the state
  addPackage: async (newPackage) => {
    const token = getTokenFromCookie();
    set({ loading: true });
    try {
      const response = await axios.post(`${API_URL}/create`, newPackage, {
        headers: {
          Authorization: `Bearer ${token}`,  // Token ekleniyor
        },
        withCredentials: true,
      });
      set((state) => ({
        packages: [...state.packages, response.data],
        error: null,
      }));
    } catch (error) {
      console.error("Failed to add package:", error);
      set({ error: 'Paket eklenirken hata oluştu.' });
    } finally {
      set({ loading: false });
    }
  },

  // Paket silme fonksiyonu
  deletePackage: async (id) => {
    const token = getTokenFromCookie();
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Token ekleniyor
        },
        withCredentials: true,
      });
      set((state) => ({
        packages: state.packages.filter((pkg) => pkg._id !== id),
        error: null,
      }));
    } catch (error) {
      console.error('Paketi silerken hata oluştu:', error);
      set({ error: 'Paket silinirken hata oluştu.' });
    } finally {
      set({ loading: false });
    }
  },

  // Paket güncelleme fonksiyonu
  updatePackage: async (id, updatedPackage) => {
    const token = getTokenFromCookie();
    set({ loading: true });
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, updatedPackage, {
        headers: {
          Authorization: `Bearer ${token}`,  // Token ekleniyor
        },
        withCredentials: true,
      });
      set((state) => ({
        packages: state.packages.map((pkg) => (pkg._id === id ? response.data : pkg)),
        error: null,
      }));
    } catch (error) {
      console.error('Paketi güncellerken hata oluştu:', error);
      set({ error: 'Paket güncellenirken hata oluştu.' });
    } finally {
      set({ loading: false });
    }
  },
}));

export default usePackageStore;