import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLocations } from '../../hooks/useLocations';
import { useCameras } from '../../hooks/useCameras';
import { 
  Monitor, 
  ChevronDown, 
  ChevronRight, 
  Video, 
  Search,
  LayoutGrid,
  Maximize,
  Grid2x2,
  Grid3x3,
  Settings2,
  FolderOpen,
  Trash2,
  Pencil,
  X
} from 'lucide-react';
import CustomDialog from '../../components/CustomDialog';

export default function MainViewTab() {
  const { locations, updateLocation, deleteLocation } = useLocations();
  const { cameras, updateCamera, deleteCamera } = useCameras();
  const routerLocation = useLocation();
  
  const isAdmin = routerLocation.pathname.startsWith('/admin');

  const [expandedLocations, setExpandedLocations] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [layout, setLayout] = useState('grid2'); // single, grid2, grid3
  const [activeCameraIndex, setActiveCameraIndex] = useState(0); // The currently focused grid cell
  const [gridCameras, setGridCameras] = useState([]); // array of camera IDs mapped to grid cells
  
  // Custom Dialog State
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: null,
    title: '',
    message: '',
    defaultValue: '',
    onConfirm: null,
  });

  const closeDialog = () => setDialogState(prev => ({ ...prev, isOpen: false }));

  // Initialize grid based on layout
  useEffect(() => {
    let cellsCount = 4; // grid2 default
    if (layout === 'single') cellsCount = 1;
    else if (layout === 'grid2') cellsCount = 4;
    else if (layout === 'grid3') cellsCount = 9;
    else if (layout === 'grid4') cellsCount = 16;
    else if (layout === 'grid1_5') cellsCount = 6;
    else if (layout === 'grid1_7') cellsCount = 8;

    setGridCameras(prev => {
      const newGrid = [...prev];
      while (newGrid.length < cellsCount) newGrid.push(null);
      return newGrid.slice(0, cellsCount);
    });
    if (activeCameraIndex >= cellsCount) {
      setActiveCameraIndex(0);
    }
  }, [layout]);

  // Toggle tree node
  const toggleLocation = (locId) => {
    setExpandedLocations(prev => ({
      ...prev,
      [locId]: !prev[locId]
    }));
  };

  // Add camera to the active grid cell and move focus to the next cell
  const handleCameraSelect = (camera) => {
    setGridCameras(prev => {
      const newGrid = [...prev];
      newGrid[activeCameraIndex] = camera;
      return newGrid;
    });
    // Move to next cell automatically
    let cellsCount = 4;
    if (layout === 'single') cellsCount = 1;
    else if (layout === 'grid3') cellsCount = 9;
    else if (layout === 'grid4') cellsCount = 16;
    else if (layout === 'grid1_5') cellsCount = 6;
    else if (layout === 'grid1_7') cellsCount = 8;
    
    setActiveCameraIndex((prev) => (prev + 1) % cellsCount);
  };

  const handleDeleteCamera = (e, id) => {
    e.stopPropagation();
    setDialogState({
      isOpen: true,
      type: 'confirm',
      title: 'Hapus Kamera',
      message: 'Apakah Anda yakin ingin menghapus kamera ini?',
      onConfirm: () => {
        deleteCamera(id);
        setGridCameras(prev => prev.map(cam => cam?.id === id ? null : cam));
        closeDialog();
      }
    });
  };

  const handleRenameLocation = (e, loc) => {
    e.stopPropagation();
    setDialogState({
      isOpen: true,
      type: 'location-prompt',
      title: 'Ubah Lokasi',
      message: 'Masukkan nama baru dan alamat lengkap untuk lokasi ini:',
      defaultValue: loc.name,
      defaultAddress: loc.address,
      onConfirm: (data) => {
        if (data && data.name && data.name.trim()) {
          updateLocation(loc.id, data.name.trim(), data.address, loc.lat, loc.lng);
        }
        closeDialog();
      }
    });
  };

  const handleDeleteLocation = (e, locId) => {
    e.stopPropagation();
    setDialogState({
      isOpen: true,
      type: 'confirm',
      title: 'Hapus Lokasi',
      message: 'Hapus lokasi ini? SEMUA KAMERA di dalam lokasi ini juga akan ikut terhapus.',
      onConfirm: () => {
        const locCams = cameras.filter(c => c.locationId === locId);
        locCams.forEach(c => {
          deleteCamera(c.id);
          setGridCameras(prev => prev.map(cam => cam?.id === c.id ? null : cam));
        });
        deleteLocation(locId);
        closeDialog();
      }
    });
  };

  const handleRenameCamera = (e, cam) => {
    e.stopPropagation();
    setDialogState({
      isOpen: true,
      type: 'prompt',
      title: 'Ubah Nama Kamera',
      message: 'Masukkan nama baru untuk kamera ini:',
      defaultValue: cam.name,
      onConfirm: (newName) => {
        if (newName && newName.trim()) {
          updateCamera(cam.id, { name: newName.trim() });
        }
        closeDialog();
      }
    });
  };

  const handleClearCell = (e, index) => {
    e.stopPropagation();
    setGridCameras(prev => {
      const newGrid = [...prev];
      newGrid[index] = null;
      return newGrid;
    });
  };

  const getLayoutClass = () => {
    switch(layout) {
      case 'single': return 'grid-cols-1 grid-rows-1';
      case 'grid2': return 'grid-cols-2 grid-rows-2';
      case 'grid3': return 'grid-cols-3 grid-rows-3';
      case 'grid4': return 'grid-cols-4 grid-rows-4';
      case 'grid1_5': return 'grid-cols-3 grid-rows-3';
      case 'grid1_7': return 'grid-cols-4 grid-rows-4';
      default: return 'grid-cols-2 grid-rows-2';
    }
  };

  const getItemClass = (index) => {
    if (layout === 'grid1_5' && index === 0) return 'col-span-2 row-span-2';
    if (layout === 'grid1_7' && index === 0) return 'col-span-3 row-span-3';
    return '';
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#111111]">
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Panel - Resource Tree */}
        <div className="w-64 bg-[#2b2b2b] border-r border-black flex flex-col h-full shrink-0 z-10 shadow-xl">
          
          {isAdmin && (
            <div className="p-3 border-b border-[#1a1a1a] bg-[#1e1e1e]">
              <h2 className="text-white font-semibold flex items-center gap-2 text-sm tracking-wide">
                <Video className="w-4 h-4 text-komdigi-green" /> MANAJEMEN CCTV
              </h2>
            </div>
          )}

          {/* Panel Header */}
          <div className="p-2 border-b border-[#1a1a1a]">
            {/* Search */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-sm py-1 pl-7 pr-2 text-xs text-gray-300 focus:outline-none focus:bg-white/10 focus:border-komdigi-green focus:ring-1 focus:ring-komdigi-green/30 transition-all duration-300"
              />
              <Search className="w-3 h-3 absolute left-2 top-1.5 text-gray-500" />
            </div>
          </div>

          {/* Tree View */}
          <div className="flex-1 overflow-y-auto p-2 text-sm text-gray-400 select-none">
            {locations.map(loc => {
              const locCameras = cameras.filter(c => c.locationId === loc.id && c.name.toLowerCase().includes(searchQuery.toLowerCase()));
              
              if (searchQuery && locCameras.length === 0) return null;

              const isExpanded = expandedLocations[loc.id] !== false; // default expanded

              return (
                <div key={loc.id} className="mb-1">
                  {/* Location Node */}
                  <div 
                    onClick={() => toggleLocation(loc.id)}
                    className="flex items-center justify-between py-1 px-1 rounded-sm cursor-pointer hover:bg-white/5 hover:translate-x-1 hover:shadow-sm transition-all duration-300 ease-out group"
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden flex-1">
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                      <FolderOpen className="w-4 h-4 text-komdigi-blue shrink-0" />
                      <span className="truncate text-xs">{loc.name}</span>
                    </div>
                    {isAdmin && (
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button 
                          onClick={(e) => handleRenameLocation(e, loc)}
                          className="p-1 hover:text-white hover:bg-slate-700 rounded transition-all text-gray-400"
                          title="Ubah Nama"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteLocation(e, loc.id)}
                          className="p-1 hover:text-red-500 hover:bg-slate-700 rounded transition-all text-gray-400"
                          title="Hapus Lokasi"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Camera Nodes */}
                  {isExpanded && (
                    <div className="ml-5 mt-1 space-y-0.5">
                      {locCameras.map(cam => (
                        <div 
                          key={cam.id}
                          onClick={() => handleCameraSelect(cam)}
                          className="flex items-center justify-between py-1 px-2 rounded-sm cursor-pointer hover:bg-white/5 hover:translate-x-1 hover:shadow-sm transition-all duration-300 ease-out group"
                        >
                          <div className="flex items-center gap-2 overflow-hidden flex-1">
                            <div className="w-2 h-2 rounded-full shrink-0 bg-komdigi-green"></div>
                            <Video className="w-3.5 h-3.5 text-gray-500 shrink-0 group-hover:text-gray-300" />
                            <span className="truncate text-xs text-gray-300 group-hover:text-white">{cam.name}</span>
                          </div>
                          {isAdmin && (
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <button 
                                onClick={(e) => handleRenameCamera(e, cam)}
                                className="p-1 hover:text-white hover:bg-slate-700 rounded transition-all text-gray-400"
                                title="Ubah Nama"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={(e) => handleDeleteCamera(e, cam.id)}
                                className="p-1 hover:text-red-500 hover:bg-slate-700 rounded transition-all text-gray-400"
                                title="Hapus Kamera"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      {locCameras.length === 0 && (
                        <div className="py-1 px-2 text-xs text-gray-600 italic">No cameras found</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Panel - Video Grid */}
        <div className="flex-1 bg-[#000000] p-1 flex flex-col overflow-hidden">
          
          <div className={`flex-1 grid gap-0.5 w-full h-full ${getLayoutClass()}`}>
            {gridCameras.map((cam, index) => {
              const isActive = index === activeCameraIndex;
              return (
                <div 
                  key={index} 
                  onClick={() => setActiveCameraIndex(index)}
                  className={`bg-[#1e1e1e] relative overflow-hidden flex justify-center items-center cursor-pointer box-border group transition-all duration-500 ease-out
                    ${isActive ? 'border border-komdigi-green shadow-[0_0_20px_rgba(0,181,170,0.35)] ring-1 ring-komdigi-green/50 z-10' : 'border border-white/5 hover:border-white/20'}
                    ${getItemClass(index)}`}
                >
                  {cam ? (
                    <>
                      <button 
                        onClick={(e) => handleClearCell(e, index)}
                        className="absolute top-1 left-1 z-10 p-1 bg-black/60 hover:bg-red-500 rounded text-white opacity-0 group-hover:opacity-100 transition-all pointer-events-auto"
                        title="Tutup Kamera"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <iframe 
                        src={`http://localhost:8888/${cam.id}/`}
                        title={cam.name}
                        className="w-full h-full border-0 pointer-events-auto"
                        allow="autoplay; fullscreen"
                      ></iframe>
                      <div className="absolute top-1 right-1 text-white font-mono text-[10px] drop-shadow-md pointer-events-none bg-black/50 px-1 rounded">
                        {new Date().toLocaleDateString('id-ID')} {new Date().toLocaleTimeString('id-ID')}
                      </div>
                      <div className="absolute bottom-1 left-1 text-white font-mono text-[10px] drop-shadow-md pointer-events-none bg-black/50 px-1 rounded">
                        {cam.name}
                      </div>
                    </>
                  ) : (
                    <div className="text-[#333] font-black text-2xl tracking-widest pointer-events-none">NO VIDEO</div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Bottom Toolbar */}
      <div className="h-12 bg-black/40 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-4 shrink-0 shadow-[0_-5px_15px_rgba(0,0,0,0.3)] z-20">
        <div className="flex items-center gap-4">
          <Settings2 className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer active:scale-90 transition-transform" />
          <span className="text-xs text-gray-500">PTZ Control</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setLayout('single')} className={`p-1.5 rounded hover:bg-white/10 active:scale-90 transition-all ${layout === 'single' ? 'text-komdigi-green shadow-[0_0_10px_rgba(0,181,170,0.2)]' : 'text-gray-400'}`} title="1x1">
            <Maximize className="w-4 h-4" />
          </button>
          <button onClick={() => setLayout('grid2')} className={`p-1.5 rounded hover:bg-white/10 active:scale-90 transition-all ${layout === 'grid2' ? 'text-komdigi-green shadow-[0_0_10px_rgba(0,181,170,0.2)]' : 'text-gray-400'}`} title="2x2">
            <Grid2x2 className="w-4 h-4" />
          </button>
          <button onClick={() => setLayout('grid3')} className={`p-1.5 rounded hover:bg-white/10 active:scale-90 transition-all ${layout === 'grid3' ? 'text-komdigi-green shadow-[0_0_10px_rgba(0,181,170,0.2)]' : 'text-gray-400'}`} title="3x3">
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button onClick={() => setLayout('grid4')} className={`p-1.5 rounded hover:bg-white/10 active:scale-90 transition-all ${layout === 'grid4' ? 'text-komdigi-green shadow-[0_0_10px_rgba(0,181,170,0.2)]' : 'text-gray-400'}`} title="4x4">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-gray-600/50 mx-1"></div>
          <button onClick={() => setLayout('grid1_5')} className={`p-1.5 rounded hover:bg-white/10 active:scale-90 transition-all text-xs font-bold ${layout === 'grid1_5' ? 'text-komdigi-green shadow-[0_0_10px_rgba(0,181,170,0.2)]' : 'text-gray-400'}`} title="1 Besar 5 Kecil">
            1+5
          </button>
          <button onClick={() => setLayout('grid1_7')} className={`p-1.5 rounded hover:bg-white/10 active:scale-90 transition-all text-xs font-bold ${layout === 'grid1_7' ? 'text-komdigi-green shadow-[0_0_10px_rgba(0,181,170,0.2)]' : 'text-gray-400'}`} title="1 Besar 7 Kecil">
            1+7
          </button>
        </div>
      </div>

      {/* Dialog Rendering */}
      <CustomDialog 
        {...dialogState} 
        onCancel={closeDialog} 
      />
    </div>
  );
}
