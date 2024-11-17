import { create } from 'zustand';
import axios from 'axios';

const useVideoStore = create((set) => ({
  personalForms: [],
  isFetching: false,
  error: null,
  videos: [],
  /*userAlerts: {}, // Kullanıcı uyarı durumları

  setUserAlert: async (userId, alert) => {
    try {
      // Local state'i güncelleyin
      set((state) => ({
        userAlerts: { ...state.userAlerts, [userId]: alert }
      }));

      // API isteği ile veritabanında alert durumunu güncelleyin
      await axios.put(`${process.env.VITE_BE_URL}/users/${userId}/alert`, { alert });
      console.log(`Kullanıcı ${userId} için alert durumu başarıyla güncellendi: ${alert}`);
    } catch (error) {
      console.error(`Alert durumu güncellenirken hata oluştu (Kullanıcı ID: ${userId}):`, error);
      set((state) => ({
        error: 'Alert durumu güncellenemedi.',
      }));
    }
  },
*/

  fetchPersonalFormsByInterview: async (interviewId) => {
    set({ isFetching: true, error: null });
    try {
      const response = await axios.get(`https://remotetech.onrender.com/api/interviews/${interviewId}/personal-forms`);
      const personalForms = response.data.userId;
      set({ personalForms, isFetching: false });
    } catch (error) {
      console.error('Personal forms getirilirken hata oluştu:', error);
      set({ error: 'Personal forms getirilemedi.', isFetching: false });
    }
  },

  getVideoUrl: async (videoId) => {
    try {
      const response = await axios.post(`${process.env.VITE_BE_URL}/upload/video-url`, { videoId });
      return response.data.videoUrl;
    } catch (error) {
      console.error('Error fetching video URL:', error);
      return null;
    }
  },

  deleteUserAndVideo: async (userId, videoId, interviewId) => {
    try {
      // Eğer video ID varsa videoyu sil
      if (videoId) {
        const deleteVideoUrl = `${process.env.VITE_BE_URL}/upload/videos/${videoId}`;
        console.log("Silinmek istenen videoId:", videoId);
        await axios.delete(deleteVideoUrl);
      } else {
        console.log("Video ID yok, yalnızca kullanıcı siliniyor.");
      }

      // Kullanıcıyı veritabanından sil
      const deleteUserUrl = `${process.env.VITE_BE_URL}/users/delete/${userId}`;
      console.log("Silinmek istenen userId:", userId);
      await axios.delete(deleteUserUrl);

      // Interview'den kullanıcı referansını sil
      const removeUserFromInterviewUrl = `${process.env.VITE_BE_URL}/interviews/${interviewId}/remove-user/${userId}`;
      await axios.put(removeUserFromInterviewUrl);

      // Kullanıcı ve video başarıyla silindiğinde state güncellemesi yap
      set((state) => ({
        personalForms: state.personalForms.filter((user) => user._id !== userId),
      }));

      console.log("Kullanıcı ve video başarıyla silindi.");
    } catch (error) {
      console.error("Kullanıcı veya video silinirken hata oluştu:", error.response?.data || error.message);
      set({ error: "Kullanıcı veya video silinirken hata oluştu." });
    }
  },

  updateVideoWatchStatus: async (videoId) => {
    try {
      await axios.put(`${process.env.VITE_BE_URL}/videos/${videoId}/watch-status`, { status: 'watched' });
      set((state) => ({
        personalForms: state.personalForms.map((form) =>
          form.videoId === videoId ? { ...form, watched: true } : form
        ),
      }));
    } catch (error) {
      console.error("Error updating video watch status:", error);
    }
  },
}));

export default useVideoStore;
