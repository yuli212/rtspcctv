import React, { useState, useEffect } from 'react';
import CameraCard from '../../components/CameraCard';
import { Activity, LayoutGrid, Maximize, Grid2x2, Grid3x3, MapPin, Map } from 'lucide-react';
import { useCameras } from '../../hooks/useCameras';
import { useLocations } from '../../hooks/useLocations';
import CameraMapView from '../../components/CameraMapView';

export default function CameraList() {
  const { locations } = useLocations();
  const { cameras } = useCameras();
  
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'grid'
  const [layout, setLayout] = useState('auto');
  const [activeLocationId, setActiveLocationId] = useState('');

  // Set default active location
  useEffect(() => {
    if (locations.length > 0 && !activeLocationId) {
      setActiveLocationId(locations[0].id);
    }
  }, [locations, activeLocationId]);

  const layoutClasses = {
    auto: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    single: "grid-cols-1 max-w-5xl mx-auto",
    grid2: "grid-cols-1 sm:grid-cols-2",
    grid3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
  };

  const getButtonClass = (targetLayout) => {
    return `p-2 rounded-lg flex items-center gap-2 transition-colors duration-200 text-sm font-medium ${
      layout === targetLayout && viewMode === 'grid'
        ? 'bg-komdigi-blue text-white shadow-sm' 
        : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
    }`;
  };

  const filteredCameras = cameras.filter(cam => cam.locationId === activeLocationId);

  const handleLocationSelectFromMap = (locId) => {
    setActiveLocationId(locId);
    setViewMode('grid');
  };

  return (
    <>
      {/* Page Title & Context */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Live Feed CCTV</h2>
        <p className="text-sm text-slate-400">Pantau seluruh feed RTSP dari titik kamera yang tersedia melalui Peta atau Grid.</p>
      </div>

      {/* Toolbar & Layout Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-slate-800 p-5 md:p-6 rounded-xl border border-slate-700 shadow-sm">
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-700 shadow-inner mr-2">
            <button 
              onClick={() => setViewMode('map')} 
              className={`p-2 rounded-lg flex items-center gap-2 transition-colors duration-200 text-sm font-medium ${viewMode === 'map' ? 'bg-komdigi-blue text-white shadow-sm' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
              title="Tampilan Peta"
            >
              <Map className="w-5 h-5" /> <span className="hidden sm:inline">Peta</span>
            </button>
            <button 
              onClick={() => setViewMode('grid')} 
              className={`p-2 rounded-lg flex items-center gap-2 transition-colors duration-200 text-sm font-medium ${viewMode === 'grid' ? 'bg-komdigi-blue text-white shadow-sm' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
              title="Tampilan Grid Biasa"
            >
              <LayoutGrid className="w-5 h-5" /> <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          <div className={`flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-700 shadow-inner transition-opacity ${viewMode === 'map' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <MapPin className="w-4 h-4 text-slate-400" />
            <select 
              className="bg-transparent text-slate-200 text-sm font-semibold focus:outline-none pr-4 w-full md:w-auto"
              value={activeLocationId}
              onChange={(e) => setActiveLocationId(e.target.value)}
              disabled={viewMode === 'map'}
            >
              {locations.length === 0 && <option value="">Belum ada lokasi</option>}
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {viewMode === 'grid' && (
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-700 shadow-inner">
            <button onClick={() => setLayout('single')} className={getButtonClass('single')} title="Spotlight (1 Kolom)">
              <Maximize className="w-5 h-5" />
            </button>
            <button onClick={() => setLayout('grid2')} className={getButtonClass('grid2')} title="Grid 2x2">
              <Grid2x2 className="w-5 h-5" />
            </button>
            <button onClick={() => setLayout('grid3')} className={getButtonClass('grid3')} title="Grid 3x3">
              <Grid3x3 className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-slate-700 mx-2"></div>
            <button onClick={() => setLayout('auto')} className={getButtonClass('auto')} title="Auto Responsif">
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area (Map or Grid) */}
      {viewMode === 'map' ? (
        <CameraMapView locations={locations} cameras={cameras} onLocationSelect={handleLocationSelectFromMap} />
      ) : (
        filteredCameras.length > 0 ? (
          <div className={`grid gap-6 transition-all duration-500 ${layoutClasses[layout]}`}>
            {filteredCameras.map(cam => (
              <CameraCard key={cam.id} camera={cam} />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-16 bg-slate-800 rounded-xl border border-slate-700 border-dashed text-center px-4">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Tidak ada kamera di lokasi ini</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              Belum ada kamera yang ditambahkan ke lokasi ini oleh Administrator.
            </p>
          </div>
        )
      )}
    </>
  );
}
