import React, { useState, useEffect } from 'react';
import { Pause, Play, ArrowLeft, Save, Trash2 } from 'lucide-react';

interface ImageViewerProps {
  images: string[];
  interval?: number;
}

export default function ImageViewer({ images, interval = 5000 }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused && images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isPaused, images.length, interval]);

  const handlePreviousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleSaveImage = async () => {
    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `memory-screen-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const handleDeleteImage = () => {
    // Here you would typically implement the delete functionality
    // For now, we'll just log it
    console.log('Delete image:', images[currentIndex]);
  };

  return (
    <div className="relative group">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/20">
        <img
          src={images[currentIndex]}
          alt={`Memory ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />
        
        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-110"
              title={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
            <button
              onClick={handlePreviousImage}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-110"
              title="Previous Image"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveImage}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-110"
              title="Save Image"
            >
              <Save size={20} />
            </button>
            <button
              onClick={handleDeleteImage}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-110 text-red-400 hover:text-red-300"
              title="Delete Image"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Image Counter */}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}