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
          : 'text-slate-300 hover:text-white hover:bg-slate-700'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <div className="font-sans antialiased min-h-screen flex flex-col bg-slate-900 text-slate-200">
      
      {/* Top Navbar */}
      <header className="w-full bg-slate-800 border-b border-slate-700 shadow-sm h-16 flex items-center">
        <div className="container mx-auto px-6 flex items-center justify-between">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-komdigi-green flex items-center justify-center shadow-lg shadow-komdigi-green/20">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              PORTAL <span className="text-komdigi-green">CCTV</span>
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2">
            <NavLink to="/dashboard/view" isActive={false}>Beranda</NavLink>
            <NavLink to="/login" isActive={location.pathname === '/login'}>Masuk</NavLink>
            <NavLink to="/register" isActive={location.pathname === '/register'}>Daftar</NavLink>
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
