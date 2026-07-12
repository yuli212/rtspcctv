import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Camera, MapPin } from 'lucide-react';

// Fix leafet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function CameraMapView({ locations, cameras, onLocationSelect }) {
  // Center map on the first location or default to Malang
  const defaultCenter = locations.length > 0 && locations[0].lat 
    ? [locations[0].lat, locations[0].lng] 
    : [-7.9666, 112.6326];

  return (
    <div className="w-full h-[60vh] min-h-[500px] rounded-xl overflow-hidden border border-slate-700 shadow-xl relative">
      <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((loc) => {
          if (!loc.lat || !loc.lng) return null;
          
          const locationCameras = cameras.filter(cam => cam.locationId === loc.id);
          
          return (
            <Marker key={loc.id} position={[loc.lat, loc.lng]}>
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px]">
                  <h3 className="font-bold text-slate-800 text-lg mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-komdigi-blue" />
                    {loc.name}
                  </h3>
                  
                  <div className="mb-4 text-slate-600 text-sm flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-200">
                    <Camera className="w-4 h-4" />
                    <span>{locationCameras.length} Kamera CCTV tersedia</span>
                  </div>
                  
                  <button 
                    onClick={() => onLocationSelect(loc.id)}
                    className="w-full bg-komdigi-blue hover:bg-[#0082c4] text-white py-2 rounded-lg text-sm font-semibold transition-colors text-center block"
                  >
                    Lihat CCTV
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
