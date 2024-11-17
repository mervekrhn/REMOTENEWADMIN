import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa'; // İkonlar için react-icons kütüphanesini kullanıyoruz
import useAuthStore from '../store/authStore';
import remoteTeachImage from '../assets/Remote-Teach2.jpg.svg.jpg'; // Görselin yolunu burada belirtiyoruz

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Şifreyi gösterip göstermeme durumu için state
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#fafafa]">
      <div className="w-11/12 h-5/6 bg-[#ecf2f8] rounded-xl shadow-xl flex">
        
        {/* Form (Sol Taraf) */}
        <div className="w-1/2 flex flex-col justify-center items-center p-10 animate-slide-in-left"> {/* Sol taraftan gelen animasyon */}
          {/* WELCOME BACK Başlığı */}
          <h1 className="text-4xl font-bold text-[#142147] mb-4">WELCOME BACK</h1> {/* Animasyon eklendi */}
          <h2 className="text-3xl font-bold text-[#142147] mb-4">Admin Login</h2> {/* Animasyon eklendi */}

          <form onSubmit={handleSubmit} className="space-y-6 w-full flex flex-col items-center"> {/* form'u da ortalamak için flex ve items-center ekledik */}
            
            {/* Email Alanı */}
            <div className="relative flex items-center w-1/2"> {/* w-1/2 ile genişliği belirledik ve flex ile ortaladık */}
              <FaEnvelope className="text-[#142147] text-lg mr-3" /> {/* Email İkonu */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full border-b-2 bg-[#ecf2f8] border-[#142147] text-[#142147] focus:outline-none focus:ring-0 p-2 pl-2"
                required
                placeholder="Email"
              />
            </div>

            {/* Password Alanı */}
            <div className="relative flex items-center w-1/2"> {/* Password için flex */}
              <FaLock className="text-[#142147] text-lg mr-3" /> {/* Password İkonu */}
              <input
                type={showPassword ? 'text' : 'password'} // Şifreyi göster/gizle
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full border-b-2 bg-[#ecf2f8] border-[#142147] text-[#142147] focus:outline-none focus:ring-0 p-2 pl-2"
                required
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Tıklanınca şifreyi göster/gizle
                className="absolute right-0 text-sm text-[#8E9FBB] hover:text-[#142147] focus:text-[#142147] focus:outline-none transition-colors"
              >
                {showPassword ? 'Gizle' : 'Göster'}
              </button>
            </div>

            {/* Buton */}
            <div className="w-1/2 flex justify-end"> {/* Butonu sağa hizalamak için justify-end kullanıldı */}
              <button
                type="submit"
                className="bg-[#142147] text-white p-2 rounded-md w-1/5 hover:bg-[#0e1b44] hover:scale-105 transition-transform duration-200 ease-in-out" // Hover ile büyüme efekti ve animasyon eklendi
              >
                Login
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </div>

        {/* Görsel (Sağ Taraf) */}
        <div
          className="w-1/2 bg-cover bg-center rounded-r-xl animate-slide-in-right" // Sağdan sola kayan animasyon
          style={{
            backgroundImage: `url(${remoteTeachImage})`, // Görsel arka plan olarak kullanılıyor
          }}
        ></div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
