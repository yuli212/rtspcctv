import React from 'react';
import { useWHEP } from '../hooks/useWHEP';
import { Video, AlertCircle, RefreshCcw, Expand, Pencil, Trash2 } from 'lucide-react';

export default function CameraCard({ camera, onEdit, onDelete }) {
    const { videoRef, status, error } = useWHEP(camera.url);

    const getStatusIndicator = () => {
        switch (status) {
            case 'connected':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-900/30 text-green-400 border border-green-800 rounded-md text-xs font-semibold shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Online
                    </span>
                );
            case 'connecting':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-900/30 text-amber-400 border border-amber-800 rounded-md text-xs font-semibold shadow-sm">
                        <RefreshCcw className="w-3 h-3 animate-spin" />
                        Connecting
                    </span>
                );
            case 'disconnected':
            case 'failed':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-900/30 text-red-400 border border-red-800 rounded-md text-xs font-semibold shadow-sm">
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
        <div className="bg-slate-800 p-6 md:p-8 rounded-xl border border-slate-700 shadow-sm flex flex-col gap-4 group">
            {/* Header */}
            <div className="flex justify-between items-center z-10 relative">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg text-slate-400">
                        <Video className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight">{camera.name}</span>
                </div>
                <div className="flex items-center gap-3">
                    {getStatusIndicator()}
                    <div className="flex items-center gap-1 ml-2 border-l border-slate-700 pl-3">
                        {onEdit && (
                            <button onClick={() => onEdit(camera)} className="p-1.5 text-slate-500 hover:text-komdigi-blue hover:bg-slate-700 rounded-lg transition-colors" title="Edit Kamera">
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}
                        {onDelete && (
                            <button onClick={() => onDelete(camera.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors" title="Hapus Kamera">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video bg-black rounded-lg flex items-center justify-center overflow-hidden group/video shadow-inner">
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
                        className="absolute bottom-3 right-3 p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 backdrop-blur-sm border border-slate-700"
                        title="Fullscreen"
                    >
                        <Expand className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
