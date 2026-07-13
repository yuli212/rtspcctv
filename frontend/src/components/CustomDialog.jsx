import React, { useState, useEffect } from 'react';
import { AlertCircle, HelpCircle, Pencil } from 'lucide-react';

export default function CustomDialog({ isOpen, type, title, message, defaultValue, onConfirm, onCancel }) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isOpen && type === 'prompt') {
      setInputValue(defaultValue || '');
    }
  }, [isOpen, type, defaultValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1e1e1e] border border-[#333] rounded-md shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="p-4 border-b border-[#2b2b2b] flex items-start gap-3">
          <div className="mt-0.5">
            {type === 'confirm' && <HelpCircle className="w-5 h-5 text-komdigi-blue" />}
            {type === 'prompt' && <Pencil className="w-5 h-5 text-komdigi-green" />}
            {type === 'alert' && <AlertCircle className="w-5 h-5 text-red-500" />}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-sm tracking-wide">{title}</h3>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        {type === 'prompt' && (
          <div className="p-4 border-b border-[#2b2b2b] bg-[#1a1a1a]">
            <input 
              type="text" 
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 bg-[#222] border border-[#444] rounded text-sm text-white focus:border-komdigi-green outline-none transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter') onConfirm(inputValue);
                if (e.key === 'Escape') onCancel();
              }}
            />
          </div>
        )}

        <div className="p-3 bg-[#2b2b2b] flex justify-end gap-2">
          {type !== 'alert' && (
            <button 
              onClick={onCancel}
              className="px-4 py-1.5 rounded-sm text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#444] transition-colors"
            >
              Batal
            </button>
          )}
          <button 
            onClick={() => type === 'prompt' ? onConfirm(inputValue) : onConfirm()}
            className={`px-4 py-1.5 rounded-sm text-xs font-semibold text-white transition-colors shadow-sm ${
              type === 'confirm' ? 'bg-red-600 hover:bg-red-700' : 'bg-komdigi-blue hover:bg-[#0082c4]'
            }`}
          >
            {type === 'alert' ? 'OK' : type === 'confirm' ? 'Hapus' : 'Simpan'}
          </button>
        </div>

      </div>
    </div>
  );
}
