import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages - Public
import Login from './pages/public/Login';

// Pages - User & Admin
import MainViewTab from './pages/user/MainViewTab';
import MapsTab from './pages/user/MapsTab';

// Dummy Placeholders for other routes
const Register = () => <div className="text-white p-8">Halaman Register (Segera Hadir)</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* 1. Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Navigate to="/dashboard/view" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* 2. User Dashboard Routes (Guest) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="view" replace />} />
          <Route path="view" element={<MainViewTab />} />
          <Route path="maps" element={<MapsTab />} />
        </Route>

        {/* 3. Admin Dashboard Routes */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="view" replace />} />
          <Route path="view" element={<MainViewTab />} />
          <Route path="maps" element={<MapsTab />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/dashboard/view" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
