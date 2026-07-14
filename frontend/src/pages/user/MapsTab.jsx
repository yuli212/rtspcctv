import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useLocations } from '../../hooks/useLocations';
import { useCameras } from '../../hooks/useCameras';
import { MapPin, X, RefreshCcw, Video, Camera, Plus, Map as MapIco } from 'lucide-react';
import CustomDialog from '../../components/CustomDialog';

// Fix leafet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to handle map clicks for new location
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  
  const markerRef = useRef(null);
  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        setPosition(marker.getLatLng());
      }
    },
  }), [setPosition]);

  return position === null ? null : (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    ></Marker>
  );
}

export default function MapsTab() {
  const { locations, addLocation } = useLocations();
  const { cameras, addCamera } = useCameras();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const isAdmin = routerLocation.pathname.startsWith('/admin');

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  
  // Admin Form States
  const [activeForm, setActiveForm] = useState(null); // 'location' or 'camera' or null
  
  // New Location Form State
  const [newLocName, setNewLocName] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocPos, setNewLocPos] = useState({ lat: -7.9666, lng: 112.6326 });
  
  // New Camera Form State
  const [newCamName, setNewCamName] = useState('');
  const [newCamUrl, setNewCamUrl] = useState('');
  const [newCamLocId, setNewCamLocId] = useState('');

  // Custom Dialog State
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: null,
    title: '',
    message: '',
    onConfirm: null,
  });

  const closeDialog = () => setDialogState(prev => ({ ...prev, isOpen: false }));

  const defaultCenter = locations.length > 0 && locations[0].lat 
    ? [locations[0].lat, locations[0].lng] 
    : [-7.9666, 112.6326];

  useEffect(() => {
    if (locations.length > 0 && !newCamLocId) {
      setNewCamLocId(locations[0].id);
    }
  }, [locations, newCamLocId]);

  const handleOpenCameraList = (loc) => {
    setSelectedLocation(loc);
  };

  const handleLiveView = () => {
    navigate(isAdmin ? '/admin/view' : '/dashboard/view');
  };

  const handleSaveLocation = (e) => {
    e.preventDefault();
    if (!newLocName.trim() || !newLocPos) return;
    addLocation(newLocName.trim(), newLocAddress.trim(), newLocPos.lat, newLocPos.lng);
    setNewLocName('');
    setNewLocAddress('');
    setActiveForm(null);
  };

  const handleSaveCamera = async (e) => {
    e.preventDefault();
    if (!newCamName.trim() || !newCamUrl.trim() || !newCamLocId) return;
    
    const result = await addCamera({ name: newCamName.trim(), url: newCamUrl.trim(), locationId: newCamLocId });
    if (result && !result.success) {
      setDialogState({
        isOpen: true,
        type: 'alert',
        title: 'Gagal Menambah Kamera',
        message: result.message,
        onConfirm: closeDialog
      });
      return;
    }

    setNewCamName('');
    setNewCamUrl('');
    setActiveForm(null);
  };

  return (
    <div className="w-full h-full flex bg-[#111111]">
      
      {/* Admin Sidebar (Only if isAdmin) */}
      {isAdmin && (
        <div className="w-80 bg-[#2b2b2b] border-r border-black flex flex-col h-full shrink-0 z-10 shadow-2xl">
          <div className="p-3 border-b border-[#1a1a1a] bg-[#1e1e1e]">
            <h2 className="text-white font-semibold flex items-center gap-2 text-sm tracking-wide">
              <MapIco className="w-4 h-4 text-komdigi-green" /> MANAJEMEN PETA
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {!activeForm ? (
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveForm('location')}
                  className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] text-gray-300 py-3 rounded-md border border-[#444] transition-colors flex items-center justify-center gap-2 text-sm font-semibold shadow-sm"
                >
                  <MapPin className="w-4 h-4 text-komdigi-green" /> Tambah Lokasi
                </button>
                <button 
                  onClick={() => setActiveForm('camera')}
                  className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] text-gray-300 py-3 rounded-md border border-[#444] transition-colors flex items-center justify-center gap-2 text-sm font-semibold shadow-sm"
                >
                  <Video className="w-4 h-4 text-komdigi-green" /> Tambah Kamera
                </button>
              </div>
            ) : activeForm === 'location' ? (
              <form onSubmit={handleSaveLocation} className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                <div className="flex items-center justify-between border-b border-[#444] pb-2 mb-4">
                  <h3 className="text-white font-bold text-sm">Tambah Lokasi Baru</h3>
                  <button type="button" onClick={() => setActiveForm(null)} className="text-gray-400 hover:text-white"><X className="w-4 h-4"/></button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Nama Lokasi</label>
                  <input 
                    type="text" 
                    value={newLocName}
                    onChange={(e) => setNewLocName(e.target.value)}
                    className="w-full p-2 bg-[#1e1e1e] border border-[#333] rounded focus:border-komdigi-green outline-none text-sm text-white transition-colors"
                    required
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Alamat Lengkap</label>
                  <textarea 
                    value={newLocAddress}
                    onChange={(e) => setNewLocAddress(e.target.value)}
                    rows={2}
                    className="w-full p-2 bg-[#1e1e1e] border border-[#333] rounded focus:border-komdigi-green outline-none text-sm text-white transition-colors resize-none"
                  />
                </div>
                <div className="bg-[#1e1e1e] p-3 rounded border border-komdigi-green/50">
                  <p className="text-xs text-komdigi-green font-medium mb-1">Instruksi:</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">Geser / klik pin di peta pada layar sebelah kanan untuk menetapkan titik koordinat lokasi ini.</p>
                  <p className="mt-2 text-[10px] text-gray-500 font-mono">
                    KOORDINAT: [{newLocPos.lat.toFixed(5)}, {newLocPos.lng.toFixed(5)}]
                  </p>
                </div>
                <button type="submit" className="w-full bg-komdigi-green hover:bg-[#00a399] text-white py-2 rounded text-sm font-semibold transition-colors mt-4 shadow-md">
                  Simpan Lokasi
                </button>
              </form>
            ) : (
              <form onSubmit={handleSaveCamera} className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                 <div className="flex items-center justify-between border-b border-[#444] pb-2 mb-4">
                  <h3 className="text-white font-bold text-sm">Tambah Kamera CCTV</h3>
                  <button type="button" onClick={() => setActiveForm(null)} className="text-gray-400 hover:text-white"><X className="w-4 h-4"/></button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Nama Kamera</label>
                  <input 
                    type="text" 
                    value={newCamName}
                    onChange={(e) => setNewCamName(e.target.value)}
                    className="w-full p-2 bg-[#1e1e1e] border border-[#333] rounded focus:border-komdigi-green outline-none text-sm text-white transition-colors"
                    required
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Stream URL (RTSP / WHEP)</label>
                  <input 
                    type="url" 
                    value={newCamUrl}
                    onChange={(e) => setNewCamUrl(e.target.value)}
                    className="w-full p-2 bg-[#1e1e1e] border border-[#333] rounded focus:border-komdigi-green outline-none text-sm text-white transition-colors"
                    required
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Pilih Lokasi CCTV</label>
                  <select 
                    value={newCamLocId}
                    onChange={(e) => setNewCamLocId(e.target.value)}
                    className="w-full p-2 bg-[#1e1e1e] border border-[#333] rounded focus:border-komdigi-green outline-none text-sm text-white transition-colors"
                    required
                  >
                    {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full bg-komdigi-green hover:bg-[#00a399] text-white py-2 rounded text-sm font-semibold transition-colors mt-4 shadow-md">
                  Simpan Kamera
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Main Map Area */}
      <div className="flex-1 relative h-full">
        <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={true} className="h-full w-full z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Render existing locations */}
          {locations.map((loc) => {
            if (!loc.lat || !loc.lng) return null;
            return (
              <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                <Popup className="custom-popup" closeButton={false}>
                  <div className="p-2 min-w-[220px]">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 uppercase tracking-wide border-b pb-1">
                      {loc.name}
                    </h3>
                    <div className="mb-4 text-slate-600 text-xs flex flex-col gap-1">
                      {loc.address && <span className="font-medium text-slate-700">{loc.address}</span>}
                      <span>LABEL: Titik Pantau CCTV</span>
                      <span>LOKASI: Koordinat {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => handleOpenCameraList(loc)}
                        className="flex-1 bg-[#00336C] hover:bg-[#00336C] text-white py-2 rounded text-sm font-bold transition-none text-center shadow-md"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Render interactive marker if adding location */}
          {activeForm === 'location' && (
             <LocationMarker position={newLocPos} setPosition={setNewLocPos} />
          )}

        </MapContainer>

        {/* Modal: Camera List for Selected Location */}
        {selectedLocation && !selectedCamera && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1e1e1e] border border-[#333] rounded-sm shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center p-3 bg-[#2b2b2b] border-b border-[#111]">
                <h3 className="font-bold text-white text-sm flex items-center gap-2 uppercase tracking-wide">
                  <MapPin className="w-4 h-4 text-komdigi-green" />
                  CCTV - {selectedLocation.name}
                </h3>
                <button onClick={() => setSelectedLocation(null)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {cameras.filter(c => c.locationId === selectedLocation.id).length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-xs uppercase tracking-wider">Tidak ada kamera di lokasi ini.</div>
                ) : (
                  <div className="space-y-1">
                    {cameras.filter(c => c.locationId === selectedLocation.id).map(cam => (
                      <button 
                        key={cam.id}
                        onClick={() => setSelectedCamera(cam)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-[#3a3a3a] rounded-sm transition-colors border border-transparent text-left group"
                      >
                        <div className="w-8 h-8 rounded shrink-0 bg-[#2b2b2b] flex items-center justify-center text-gray-500 group-hover:text-komdigi-green transition-colors">
                          <Video className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-300 text-sm truncate group-hover:text-white">{cam.name}</div>
                          <div className="text-[10px] text-gray-500 truncate">{cam.url}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Single Camera Stream */}
        {selectedCamera && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#111111]/95 backdrop-blur-md p-4">
            <div className="bg-[#1e1e1e] border border-[#333] rounded-sm shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
              
              {/* Header */}
              <div className="flex justify-between items-center p-3 bg-[#2b2b2b] border-b border-[#111]">
                <div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-wide">Live Stream</h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{selectedCamera.name} - {selectedLocation?.name}</p>
                </div>
                <div className="flex gap-4 items-center text-gray-400">
                  <button title="Refresh"><RefreshCcw className="w-4 h-4 hover:text-white" /></button>
                  <button onClick={() => setSelectedCamera(null)} title="Close"><X className="w-4 h-4 hover:text-komdigi-green" /></button>
                </div>
              </div>
              
              {/* Video Player */}
              <div className="w-full aspect-video bg-black relative flex justify-center items-center">
                 <iframe 
                    src={`http://localhost:8888/${selectedCamera.id}/`}
                    title="Live Feed"
                    className="w-full h-full border-0 pointer-events-auto"
                    allow="autoplay; fullscreen"
                  ></iframe>
                 
                 <div className="absolute top-4 left-4 text-white font-mono text-[10px] drop-shadow-md pointer-events-none bg-black/50 px-2 py-1 rounded">
                   {new Date().toLocaleDateString('id-ID')} {new Date().toLocaleTimeString('id-ID')}
                 </div>
                 <div className="absolute bottom-4 left-4 text-white font-mono text-xs font-bold drop-shadow-md pointer-events-none bg-black/50 px-2 py-1 rounded">
                   {selectedLocation?.name.toUpperCase()}
                 </div>
                 <div className="absolute bottom-4 right-4 text-white font-mono text-xs font-bold drop-shadow-md pointer-events-none bg-black/50 px-2 py-1 rounded">
                   {selectedCamera.name.toUpperCase()}
                 </div>
              </div>

              {/* Footer */}
              <div className="p-3 bg-[#2b2b2b] border-t border-[#111] flex justify-end">
                <button 
                  onClick={handleLiveView}
                  className="bg-komdigi-blue hover:bg-[#0082c4] text-white px-6 py-1.5 rounded-sm text-sm font-semibold transition-colors uppercase tracking-wider"
                >
                  Buka di Main View
                </button>
              </div>

            </div>
          </div>
        )}
      </div>

      <CustomDialog 
        {...dialogState} 
        onCancel={closeDialog} 
      />
    </div>
  );
}
