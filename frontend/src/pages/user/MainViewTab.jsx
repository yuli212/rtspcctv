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
  Trash2
} from 'lucide-react';

export default function MainViewTab() {
  const { locations } = useLocations();
  const { cameras, deleteCamera } = useCameras();
  const routerLocation = useLocation();
  
  const isAdmin = routerLocation.pathname.startsWith('/admin');

  const [expandedLocations, setExpandedLocations] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [layout, setLayout] = useState('grid2'); // single, grid2, grid3
  const [activeCameraIndex, setActiveCameraIndex] = useState(0); // The currently focused grid cell
  const [gridCameras, setGridCameras] = useState([]); // array of camera IDs mapped to grid cells

  // Initialize grid based on layout
  useEffect(() => {
    const cellsCount = layout === 'single' ? 1 : layout === 'grid2' ? 4 : 9;
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
    const cellsCount = layout === 'single' ? 1 : layout === 'grid2' ? 4 : 9;
    setActiveCameraIndex((prev) => (prev + 1) % cellsCount);
  };

  const handleDeleteCamera = (e, id) => {
    e.stopPropagation();
    if(window.confirm('Hapus kamera ini?')) {
      deleteCamera(id);
      // Remove from grid if it was playing
      setGridCameras(prev => prev.map(cam => cam?.id === id ? null : cam));
    }
  };

  const getLayoutClass = () => {
    switch(layout) {
      case 'single': return 'grid-cols-1 grid-rows-1';
      case 'grid2': return 'grid-cols-2 grid-rows-2';
      case 'grid3': return 'grid-cols-3 grid-rows-3';
      default: return 'grid-cols-2 grid-rows-2';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#111111]">
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Panel - Resource Tree */}
        <div className="w-64 bg-[#2b2b2b] border-r border-black flex flex-col h-full shrink-0">
          
          {/* Panel Header */}
          <div className="p-2 border-b border-[#1a1a1a]">
            <div className="flex gap-2 mb-2">
              <button className="flex-1 bg-[#3a3a3a] text-xs font-semibold py-1.5 rounded-sm text-gray-300 border-t-2 border-t-komdigi-green">Resource</button>
              {isAdmin && <button className="flex-1 bg-transparent hover:bg-[#333] text-xs font-semibold py-1.5 rounded-sm text-gray-500 transition-colors">Custom View</button>}
            </div>
            
            {/* Search */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-[#333] rounded-sm py-1 pl-7 pr-2 text-xs text-gray-300 focus:outline-none focus:border-komdigi-green transition-colors"
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
                    className="flex items-center gap-1.5 py-1 px-1 hover:bg-[#3a3a3a] rounded-sm cursor-pointer transition-colors"
                  >
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    <FolderOpen className="w-4 h-4 text-komdigi-blue" />
                    <span className="truncate text-xs">{loc.name}</span>
                  </div>
                  
                  {/* Camera Nodes */}
                  {isExpanded && (
                    <div className="ml-5 mt-1 space-y-0.5">
                      {locCameras.map(cam => (
                        <div 
                          key={cam.id}
                          onClick={() => handleCameraSelect(cam)}
                          className="flex items-center justify-between py-1 px-2 hover:bg-[#3a3a3a] rounded-sm cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div className="w-2 h-2 rounded-full shrink-0 bg-komdigi-green"></div>
                            <Video className="w-3.5 h-3.5 text-gray-500 shrink-0 group-hover:text-gray-300" />
                            <span className="truncate text-xs text-gray-300 group-hover:text-white">{cam.name}</span>
                          </div>
                          {isAdmin && (
                            <button 
                              onClick={(e) => handleDeleteCamera(e, cam.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 hover:bg-slate-700 rounded transition-all shrink-0"
                              title="Hapus Kamera"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
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
                  className={`bg-[#1e1e1e] relative overflow-hidden flex justify-center items-center cursor-pointer transition-all box-border
                    ${isActive ? 'border-2 border-komdigi-green' : 'border border-[#333] hover:border-gray-500'}`}
                >
                  {cam ? (
                    <>
                      <img 
                        src={`http://localhost:8888/${cam.id}/`}
                        alt={cam.name}
                        className="w-full h-full object-contain pointer-events-none"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.parentElement.innerHTML = `
                            <div class="flex flex-col items-center justify-center h-full w-full pointer-events-none">
                              <span class="text-[#4a4a4a] text-xl md:text-3xl font-black mb-2 uppercase tracking-widest">NO VIDEO</span>
                              <span class="text-[10px] text-gray-600">${cam.url}</span>
                            </div>
                            <div class="absolute bottom-1 left-1 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white font-mono pointer-events-none">
                              ${cam.name}
                            </div>
                          `;
                        }}
                      />
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
      <div className="h-10 bg-[#2b2b2b] border-t border-black flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Settings2 className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
          <span className="text-xs text-gray-500">PTZ Control</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setLayout('single')} className={`p-1.5 rounded hover:bg-[#444] transition-colors ${layout === 'single' ? 'text-komdigi-green' : 'text-gray-400'}`}>
            <Maximize className="w-4 h-4" />
          </button>
          <button onClick={() => setLayout('grid2')} className={`p-1.5 rounded hover:bg-[#444] transition-colors ${layout === 'grid2' ? 'text-komdigi-green' : 'text-gray-400'}`}>
            <Grid2x2 className="w-4 h-4" />
          </button>
          <button onClick={() => setLayout('grid3')} className={`p-1.5 rounded hover:bg-[#444] transition-colors ${layout === 'grid3' ? 'text-komdigi-green' : 'text-gray-400'}`}>
            <Grid3x3 className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-gray-600 mx-1"></div>
          <button className="p-1.5 rounded hover:bg-[#444] text-gray-400 transition-colors">
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
