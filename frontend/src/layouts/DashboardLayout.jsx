import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, LogIn, LogOut, Monitor, Map as MapIcon, ShieldCheck } from 'lucide-react';

export default function DashboardLayout() {
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isAdmin = location.pathname.startsWith('/admin');
  const basePath = isAdmin ? '/admin' : '/dashboard';

  const isMainView = location.pathname.includes(`${basePath}/view`);
  const isMapsView = location.pathname.includes(`${basePath}/maps`);

  return (
    <div className="font-sans antialiased h-screen flex flex-col bg-[#1a1a1a] text-gray-300 overflow-hidden">
      
      {/* Top Navbar - iVMS Style */}
      <header className="flex-none bg-[#242424] border-b border-black flex items-center justify-between h-14">
        
        {/* Left: Logo & Tabs */}
        <div className="flex items-center h-full">
          {/* Logo Area */}
          <div className="flex items-center gap-3 px-4 h-full border-r border-[#333] min-w-[200px]">
            {isAdmin ? <ShieldCheck className="text-komdigi-green w-6 h-6" /> : <Activity className="text-komdigi-green w-6 h-6" />}
            <h1 className="text-sm font-bold text-gray-200 tracking-wider hidden md:block">
              {isAdmin ? 'ADMIN PANEL CCTV' : 'CCTV KOMDIGI MALANG'}
            </h1>
            <h1 className="text-sm font-bold text-gray-200 tracking-wider md:hidden">
              {isAdmin ? 'ADMIN CCTV' : 'CCTV KOMDIGI'}
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex h-full">
            <Link 
              to={`${basePath}/view`}
              className={`flex items-center gap-2 px-6 h-full border-r border-[#333] transition-colors ${
                isMainView 
                  ? 'bg-[#3a3a3a] text-white border-t-2 border-t-komdigi-green' 
                  : 'hover:bg-[#2a2a2a] text-gray-400 border-t-2 border-t-transparent'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Main View</span>
            </Link>
            
            <Link 
              to={`${basePath}/maps`}
              className={`flex items-center gap-2 px-6 h-full border-r border-[#333] transition-colors ${
                isMapsView 
                  ? 'bg-[#3a3a3a] text-white border-t-2 border-t-komdigi-green' 
                  : 'hover:bg-[#2a2a2a] text-gray-400 border-t-2 border-t-transparent'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Maps</span>
            </Link>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center h-full">
          <div className="flex flex-col justify-center px-4 h-full border-l border-[#333] text-right">
            <div className="text-xs font-bold text-gray-200">
              {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-[10px] text-gray-500">
              {time.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
          
          {isAdmin ? (
            <Link 
              to="/dashboard/view"
              className="flex items-center gap-2 px-6 h-full bg-slate-800 hover:bg-slate-700 border-l border-[#333] transition-colors text-white font-semibold text-xs uppercase"
              title="Keluar dari Admin"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span className="hidden sm:inline">Keluar</span>
            </Link>
          ) : (
            <Link 
              to="/login"
              className="flex items-center gap-2 px-4 h-full bg-[#1e1e1e] hover:bg-[#333] border-l border-[#333] transition-colors text-gray-400 hover:text-white"
              title="Login Admin"
            >
              <LogIn className="w-4 h-4" />
            </Link>
          )}
        </div>

      </header>

      {/* Main Container - Renders the active Tab */}
      <div className="flex-1 overflow-hidden relative">
        <Outlet />
      </div>

    </div>
  );
}
