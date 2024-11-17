// frontend/src/components/LoginForm.jsx
/*import React, { useState } from 'react';
import useAuthStore from '../store/authStore';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-[#142147]">HOŞGELDİNİZ!</h3>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#142147] mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-[#8E9FBB] p-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#142147]"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#142147] mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-[#8E9FBB] p-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#142147]"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" className="bg-[#142147] text-white p-4 rounded-md w-full hover:bg-[#0e1b44] transition-colors">
        Log in
      </button>
    </form>
  );
};

export default LoginForm;*/