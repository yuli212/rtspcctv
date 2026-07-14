import { useState, useEffect } from 'react';

const DEFAULT_LOCATIONS = [
  { id: 'loc1', name: 'Kantor Utama', address: 'Jl. Merdeka No.1, Malang', lat: -7.9666, lng: 112.6326 },
  { id: 'loc2', name: 'Cabang A', address: 'Jl. Sudirman No.5, Malang', lat: -7.9500, lng: 112.6200 },
];

export function useLocations() {
  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem('cctv_locations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse locations from localStorage", e);
      }
    }
    return DEFAULT_LOCATIONS;
  });

  useEffect(() => {
    localStorage.setItem('cctv_locations', JSON.stringify(locations));
  }, [locations]);

  const addLocation = (name, address = '', lat = -7.9666, lng = 112.6326) => {
    const newLocation = {
      id: `loc_${Date.now()}`,
      name: name.trim(),
      address: address.trim(),
      lat,
      lng
    };
    setLocations(prev => [...prev, newLocation]);
    return newLocation;
  };

  const updateLocation = (id, newName, newAddress, lat, lng) => {
    setLocations(prev => prev.map(loc => loc.id === id ? { ...loc, name: newName.trim(), address: newAddress?.trim() || '', lat, lng } : loc));
  };

  const deleteLocation = (id) => {
    setLocations(prev => prev.filter(loc => loc.id !== id));
  };

  return { locations, addLocation, updateLocation, deleteLocation };
}
