import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoLogOutOutline } from 'react-icons/io5';

const Header = () => {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BE_URL;

  // Logout işlemi
  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/auth/logout`, {}, { withCredentials: true });
      // Cookie'yi sil ve kullanıcıyı giriş sayfasına yönlendir
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="fixed top-0 right-0 z-50 h-[50px] bg-slate-800 flex items-center shadow-md w-10/12">
      {/* Sol Taraf: Sayfa Başlığı */}
      <div className="text-white text-lg font-semibold px-4">
        Remote-tech Admin Page
      </div>

      {/* Sağ Taraf: Kullanıcı Adı ve İkon */}
      <div className="flex items-center space-x-4 ml-auto pr-4">
        <button className="text-gray-300 hover:text-gray-100 transition-colors duration-200">
          <i className="fas fa-sync-alt"></i>
        </button>
        {/* Logout Butonu */}
        <button
          onClick={handleLogout}
          className="text-gray-300 hover:text-gray-100 transition-colors duration-200"
        >
          <IoLogOutOutline size={24} />
        </button>
      </div>
    </div>
  );
};

export default Header;
