import React from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-black/90 rounded-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="relative pt-[56.25%]">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
            title="MemoryScreen Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}