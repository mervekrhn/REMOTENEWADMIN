import { create } from 'zustand'; 
import axios from 'axios';

// Cookie'den token'ı alma fonksiyonu
const getTokenFromCookie = () => {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

const API_URL = `${import.meta.env.VITE_BE_URL}/interviews`; // Backtick ile template literal düzeltildi

const useInterviewStore = create((set) => ({
  interviews: [],
  loading: false,
  error: null,

  // Mülakatları çekme işlemi
  fetchInterviews: async () => {
    const token = getTokenFromCookie();
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/list`, { // Backtick ile düzeltildi
        headers: {
          Authorization: `Bearer ${token}`, // Backtick ile düzeltildi
        },
        withCredentials: true, // Cookie gönderimi için gerekli
      });
      set({ interviews: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching interviews:', error);
      set({ error: 'Mülakatlar getirilemedi.', loading: false });
    }
  },

  // Yeni mülakat ekleme işlemi
  addInterview: async (interviewData) => {
    const token = getTokenFromCookie();
    set({ loading: true });
    try {
      const response = await axios.post(`${API_URL}/create`, interviewData, { // Backtick ile düzeltildi
        headers: {
          Authorization: `Bearer ${token}`, // Backtick ile düzeltildi
        },
        withCredentials: true,
      });
      set((state) => ({
        interviews: [...state.interviews, response.data],
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Error adding interview:', error);
      set({ error: 'Mülakat eklenirken hata oluştu.', loading: false });
    }
  },

  // Mülakat güncelleme işlemi
  updateInterview: async (id, interviewData) => {
    const token = getTokenFromCookie();
    set({ loading: true });
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, interviewData, { // Backtick ile düzeltildi
        headers: {
          Authorization: `Bearer ${token}`, // Backtick ile düzeltildi
        },
        withCredentials: true,
      });
      set((state) => ({
        interviews: state.interviews.map((interview) =>
          interview._id === id ? response.data : interview
        ),
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Error updating interview:', error);
      set({ error: 'Mülakat güncellenirken hata oluştu.', loading: false });
    }
  },

  // Mülakat silme işlemi
  deleteInterview: async (id) => {
    const token = getTokenFromCookie();
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/delete/${id}`, { // Backtick ile düzeltildi
        headers: {
          Authorization: `Bearer ${token}`, // Backtick ile düzeltildi
        },
        withCredentials: true,
      });
      set((state) => ({
        interviews: state.interviews.filter((interview) => interview._id !== id),
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Error deleting interview:', error);
      set({ error: 'Mülakat silinirken hata oluştu.', loading: false });
    }
  },
}));

export default useInterviewStore;
