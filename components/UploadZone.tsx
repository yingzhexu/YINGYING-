import React, { useRef } from 'react';

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFilesSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
    // Reset value so same file can be selected again if needed
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div 
      className="w-full max-w-xl mx-auto mt-6 p-8 rounded-3xl border border-white/40 bg-white/40 backdrop-blur-md hover:bg-white/60 transition-all duration-500 cursor-pointer group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        className="hidden" 
        ref={inputRef}
        onChange={handleChange}
      />
      
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-white/80 shadow-sm flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-1 group-hover:text-black transition-colors">
          点击或拖拽上传图片
        </h3>
        <p className="text-sm text-gray-500 font-light group-hover:text-gray-600 transition-colors">
          支持 JPG/PNG · 智能批量处理
        </p>
      </div>
    </div>
  );
};