import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import ManagePackages from './pages/ManagePackages';
import InterviewList from './pages/InterviewList';
import CreatePackage from './pages/CreatePackage';
import AdminLoginPage from './pages/AdminLoginPage';
import VideoListPage from './pages/VideoListPage';
import useAuthStore from './store/authStore'; // Auth store'u import edin

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Yönlendirme için
  const { getTokenFromCookie, isLoggedIn } = useAuthStore(); // Store'dan token kontrol fonksiyonunu alın

  useEffect(() => {
    // Token veya login durumu değiştiğinde tetiklenecek
    const token = getTokenFromCookie();
    console.log("document.cookie:", document.cookie); // Tüm cookie'leri yazdır
    console.log("Extracted Token:", token); // getTokenFromCookie'den dönen token

    // Eğer kullanıcı login olmuşsa veya token varsa yönlendir
    if ((isLoggedIn || token) && location.pathname === '/login') {
      navigate('/manage-packages'); // Token varsa login sayfasından manage-packages'e yönlendir
    }
  }, [isLoggedIn, location.pathname, navigate, getTokenFromCookie]);

  const isLoginPage = location.pathname === '/login'; // Şu anki sayfanın login sayfası olup olmadığını kontrol edin

  return (
    <>
      {!isLoginPage && <Header />}
      <div>
        {!isLoginPage && <Navbar />}
        <div className={isLoginPage ? '' : 'container mx-auto p-4 pt-[80px]'}>
          <Routes>
            <Route path="/login" element={<AdminLoginPage />} />
            <Route path="/manage-packages" element={<ManagePackages />} />
            <Route path="/interview-list" element={<InterviewList />} />
            <Route path="/create-package" element={<CreatePackage />} />
            <Route path="/see-videos/:interviewId" element={<VideoListPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
