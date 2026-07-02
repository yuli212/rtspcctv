import React, { useState, useEffect } from 'react';
import CameraCard from './components/CameraCard';
import { Activity, LayoutGrid, Maximize, Grid2x2, Grid3x3, Plus } from 'lucide-react';
import { useCameras } from './hooks/useCameras';
import CameraFormModal from './components/CameraFormModal';

function App() {
  const { cameras, addCamera, updateCamera, deleteCamera } = useCameras();
  const [time, setTime] = useState(new Date());
  const [layout, setLayout] = useState('auto'); // auto, single, grid2, grid3
  const [selectedCameraId, setSelectedCameraId] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Map layout state to Tailwind CSS grid classes
  const layoutClasses = {
    auto: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    single: "grid-cols-1 max-w-5xl mx-auto",
    grid2: "grid-cols-1 sm:grid-cols-2",
    grid3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
  };

  const getButtonClass = (targetLayout) => {
    return `p-2 rounded-lg flex items-center gap-2 transition-colors duration-200 text-sm font-medium ${
      layout === targetLayout 
        ? 'bg-blue-100 text-blue-700' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
    }`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header Premium Light */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Activity className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                Live Monitoring
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">PRO</span>
              </h1>
              <p className="text-sm text-slate-500 font-medium">Dinas Informatika Kabupaten Malang</p>
            </div>
          </div>

          {/* Clock & Status */}
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-700">
                {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-xs text-slate-500">
                {time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        
        {/* Toolbar & Layout Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <h2 className="text-base font-bold text-slate-700 ml-2 hidden sm:block whitespace-nowrap">Kamera:</h2>
            <select 
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 outline-none"
              value={selectedCameraId}
              onChange={(e) => {
                setSelectedCameraId(e.target.value);
                if (e.target.value !== 'all') {
                  setLayout('single');
                } else {
                  setLayout('auto');
                }
              }}
            >
              <option value="all">Show All</option>
              {cameras.map(cam => (
                <option key={cam.id} value={cam.id}>{cam.name}</option>
              ))}
            </select>
            <button
              onClick={() => { setEditingCamera(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm shadow-blue-600/20"
              title="Tambah Kamera Baru"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah</span>
            </button>
          </div>
          
          <div className="flex items-center bg-slate-50 p-1 rounded-lg border border-slate-100">
            <button 
              onClick={() => { setLayout('single'); setSelectedCameraId('all'); }} 
              className={getButtonClass('single')}
              title="Spotlight (1 Kolom)"
            >
              <Maximize className="w-5 h-5" />
            </button>
            <button 
              onClick={() => { setLayout('grid2'); setSelectedCameraId('all'); }} 
              className={getButtonClass('grid2')}
              title="Grid 2x2"
            >
              <Grid2x2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => { setLayout('grid3'); setSelectedCameraId('all'); }} 
              className={getButtonClass('grid3')}
              title="Grid 3x3"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <button 
              onClick={() => { setLayout('auto'); setSelectedCameraId('all'); }} 
              className={getButtonClass('auto')}
              title="Auto Responsif"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid Kamera Dinamis */}
        <div className={`grid gap-6 transition-all duration-500 ${layoutClasses[layout]}`}>
          {cameras.filter(cam => selectedCameraId === 'all' || cam.id === selectedCameraId).map(cam => (
            <CameraCard 
              key={cam.id} 
              camera={cam} 
              onEdit={(camData) => { setEditingCamera(camData); setIsModalOpen(true); }}
              onDelete={(id) => { if(window.confirm('Yakin ingin menghapus kamera ini?')) deleteCamera(id); }}
            />
          ))}
        </div>

      </main>

      {/* Modal Form Kamera */}
      <CameraFormModal 
        isOpen={isModalOpen}
        initialData={editingCamera}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCamera(null);
        }}
        onSave={(cameraData) => {
          if (editingCamera) {
            updateCamera(editingCamera.id, cameraData);
          } else {
            addCamera(cameraData);
          }
        }}
      />
    </div>
  );
}

export default App;
