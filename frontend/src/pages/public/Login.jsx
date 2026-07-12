import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    navigate('/admin/cameras');
  };

  return (
    <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
          <input type="text" className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-komdigi-blue outline-none" placeholder="admin" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <input type="password" className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-komdigi-blue outline-none" placeholder="••••••••" required />
        </div>
        <button type="submit" className="w-full bg-komdigi-blue hover:bg-[#0082c4] text-white py-2.5 rounded-lg font-semibold transition-colors mt-2">
          Login
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-slate-400">
        <Link to="/" className="hover:text-white transition-colors">Kembali ke Halaman Utama</Link>
      </div>
    </div>
  );
}
