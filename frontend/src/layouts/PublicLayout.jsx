import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function PublicLayout() {
  const location = useLocation();

  const NavLink = ({ to, children, isActive }) => (
    <Link 
      to={to} 
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
        isActive 
          ? 'bg-komdigi-green text-white shadow-sm' 
          : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <div className="font-sans antialiased min-h-screen flex flex-col bg-[#1a1a1a] text-gray-300">
      
      {/* Top Navbar */}
      <header className="flex-none bg-[#242424] border-b border-black h-16 flex items-center justify-between">
        <div className="w-full px-6 flex items-center justify-between">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3 h-full">
            <img src="/logo.png" alt="Logo" className="h-8 md:h-10 w-auto object-contain" />
            <h1 className="text-sm font-bold text-gray-200 tracking-wider hidden md:block">
              PANTAU DISKOMINFO
            </h1>
            <h1 className="text-sm font-bold text-gray-200 tracking-wider md:hidden">
              PANTAU DISKOMINFO
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2">
            <NavLink to="/dashboard/view" isActive={false}>Beranda</NavLink>
            <NavLink to="/login" isActive={location.pathname === '/login'}>Masuk</NavLink>
          </nav>

        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center p-6 md:p-12 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-komdigi-green/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-komdigi-blue/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="w-full max-w-md z-10">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
