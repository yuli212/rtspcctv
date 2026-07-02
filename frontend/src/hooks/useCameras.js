import { useState, useEffect } from 'react';

const DEFAULT_CAMERAS = [
  { id: 'cam1', name: 'Camera Source 1', url: 'http://localhost:8889/camera-dummy/whep' },
  { id: 'cam2', name: 'Camera Source 2', url: 'http://localhost:8889/camera-dummy/whep' },
  { id: 'cam3', name: 'Camera Source 3', url: 'http://localhost:8889/camera-dummy/whep' },
  { id: 'cam4', name: 'Camera Source 4', url: 'http://localhost:8889/camera-dummy/whep' },
  { id: 'cam5', name: 'Camera Source 5', url: 'http://localhost:8889/camera-dummy/whep' },
  { id: 'cam6', name: 'Camera Source 6', url: 'http://localhost:8889/camera-dummy/whep' }
];

export function useCameras() {
  const [cameras, setCameras] = useState(() => {
    const saved = localStorage.getItem('cctv_cameras');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse cameras from localStorage", e);
      }
    }
    return DEFAULT_CAMERAS;
  });

  useEffect(() => {
    localStorage.setItem('cctv_cameras', JSON.stringify(cameras));
  }, [cameras]);

  const addCamera = (cameraData) => {
    const newCamera = {
      ...cameraData,
      id: `cam_${Date.now()}` // generate simple unique ID
    };
    setCameras(prev => [...prev, newCamera]);
  };

  const updateCamera = (id, updatedData) => {
    setCameras(prev => prev.map(cam => cam.id === id ? { ...cam, ...updatedData } : cam));
  };

  const deleteCamera = (id) => {
    setCameras(prev => prev.filter(cam => cam.id !== id));
  };

  return { cameras, addCamera, updateCamera, deleteCamera };
}
