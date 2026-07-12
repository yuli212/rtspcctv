import { useState, useEffect } from 'react';

const DEFAULT_CAMERAS = [
  { id: 'cam1', name: 'Camera Lobi', url: 'http://localhost:8889/camera-dummy/whep', locationId: 'loc1' },
  { id: 'cam2', name: 'Camera Parkiran', url: 'http://localhost:8889/camera-dummy/whep', locationId: 'loc1' },
  { id: 'cam3', name: 'Camera Gudang', url: 'http://localhost:8889/camera-dummy/whep', locationId: 'loc2' }
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

  const addCamera = async (cameraData) => {
    const id = `cam_${Date.now()}`;
    let finalUrl = cameraData.url;

    if (cameraData.url.startsWith('rtsp://')) {
      try {
        const response = await fetch(`/api/mediamtx/v3/config/paths/add/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source: cameraData.url, sourceOnDemand: true })
        });
        if (!response.ok) throw new Error("API error");
        finalUrl = `http://localhost:8889/${id}/whep`;
      } catch (err) {
        console.error("Failed to register RTSP", err);
        alert("Gagal mendaftarkan RTSP ke MediaMTX. Pastikan mediamtx.yml memiliki api: yes dan sudah direstart.");
        return;
      }
    }

    const newCamera = {
      ...cameraData,
      url: finalUrl,
      originalRtsp: cameraData.url.startsWith('rtsp://') ? cameraData.url : '',
      id
    };
    setCameras(prev => [...prev, newCamera]);
  };

  const updateCamera = (id, updatedData) => {
    // Note: For simplicity, editing RTSP URL requires recreating the path. 
    // In this basic version, we just update the local state.
    setCameras(prev => prev.map(cam => cam.id === id ? { ...cam, ...updatedData } : cam));
  };

  const deleteCamera = async (id) => {
    try {
      await fetch(`/api/mediamtx/v3/config/paths/delete/${id}`, { method: 'POST' });
    } catch(err) {
      console.log("Path not found in MediaMTX or error", err);
    }
    setCameras(prev => prev.filter(cam => cam.id !== id));
  };

  return { cameras, addCamera, updateCamera, deleteCamera };
}
