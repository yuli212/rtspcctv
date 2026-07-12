import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="text-center max-w-lg">
      <h2 className="text-3xl font-bold text-white mb-4">Selamat Datang di Portal CCTV</h2>
      <p className="text-slate-400 mb-8">
        Sistem pemantauan CCTV secara real-time. Silakan pilih portal masuk Anda.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/login" className="bg-komdigi-blue hover:bg-[#0082c4] text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm">
          Login Admin
        </Link>
        <Link to="/dashboard/cameras" className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm">
          Masuk sebagai Guest
        </Link>
      </div>
    </div>
  );
}
