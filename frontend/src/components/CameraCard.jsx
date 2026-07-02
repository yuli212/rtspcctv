import React from 'react';
import { useWHEP } from '../hooks/useWHEP';
import { Video, AlertCircle, RefreshCcw, Expand, Pencil, Trash2 } from 'lucide-react';

export default function CameraCard({ camera, onEdit, onDelete }) {
    const { videoRef, status, error } = useWHEP(camera.url);

    const getStatusIndicator = () => {
        switch (status) {
            case 'connected':
                return (
                    <span className="flex items-center gap-2 text-xs font-medium px-2 py-1 bg-green-50 text-green-600 rounded-full border border-green-200 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Online
                    </span>
                );
            case 'connecting':
                return (
                    <span className="flex items-center gap-2 text-xs font-medium px-2 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-200 shadow-sm">
                        <RefreshCcw className="w-3 h-3 animate-spin" />
                        Connecting
                    </span>
                );
            case 'disconnected':
            case 'failed':
                return (
                    <span className="flex items-center gap-2 text-xs font-medium px-2 py-1 bg-red-50 text-red-600 rounded-full border border-red-200 shadow-sm">
                        <AlertCircle className="w-3 h-3" />
                        Offline
                    </span>
                );
            default:
                return null;
        }
    };

    const handleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if (videoRef.current.webkitRequestFullscreen) { /* Safari */
                videoRef.current.webkitRequestFullscreen();
            } else if (videoRef.current.msRequestFullscreen) { /* IE11 */
                videoRef.current.msRequestFullscreen();
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300 group">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm z-10 relative">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Video className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-700">{camera.name}</span>
                </div>
                <div className="flex items-center gap-2">
                    {getStatusIndicator()}
                    {onEdit && (
                        <button onClick={() => onEdit(camera)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Kamera">
                            <Pencil className="w-4 h-4" />
                        </button>
                    )}
                    {onDelete && (
                        <button onClick={() => onDelete(camera.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Kamera">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden group/video">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-contain transition-opacity duration-500 ${status === 'connected' ? 'opacity-100' : 'opacity-30'}`}
                />
                
                {/* Overlay saat offline/connecting */}
                {status !== 'connected' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        {status === 'connecting' ? (
                            <RefreshCcw className="w-8 h-8 animate-spin text-slate-500 mb-2" />
                        ) : (
                            <AlertCircle className="w-8 h-8 text-slate-500 mb-2" />
                        )}
                        <span className="text-sm font-medium">
                            {status === 'connecting' ? 'Membuat koneksi WHEP...' : 'Kamera tidak terjangkau'}
                        </span>
                        {error && <span className="text-xs text-red-400 mt-2 max-w-xs text-center">{error}</span>}
                    </div>
                )}

                {/* Fullscreen Button */}
                {status === 'connected' && (
                    <button 
                        onClick={handleFullscreen}
                        className="absolute bottom-3 right-3 p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
                        title="Fullscreen"
                    >
                        <Expand className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
