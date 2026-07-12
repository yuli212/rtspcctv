import React from 'react';
import { Activity } from 'lucide-react';

export default function DashboardOverview() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center">
      <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-900/20">
        <Activity className="w-8 h-8 text-komdigi-green" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Selamat Datang di Dashboard User</h2>
      <p className="text-slate-400 max-w-md">
        Di sini Anda dapat memantau berbagai feed CCTV sesuai dengan lokasi yang telah ditentukan oleh Administrator.
        Silakan navigasi ke menu "Kamera CCTV" di sidebar untuk mulai memantau.
      </p>
    </div>
  );
}
