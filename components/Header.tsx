import React from 'react';

interface HeaderProps {
  onApiKeyChange?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onApiKeyChange }) => {
  return (
    <header className="w-full py-4 px-4 md:px-8 sticky top-0 z-50 transition-all duration-300">
      {/* Glass container */}
      <div className="max-w-7xl mx-auto rounded-2xl glass shadow-sm flex flex-row justify-between items-center px-6 py-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tight text-fashion-900 drop-shadow-sm">
            YINGYING
          </h1>
          <span className="text-[10px] md:text-xs font-sans font-medium tracking-widest uppercase text-gray-600/80">哲旭出品 必属精品</span>
        </div>
        <div className="flex items-center gap-4">
           {onApiKeyChange && (
             <button 
               onClick={onApiKeyChange}
               className="text-xs font-medium text-gray-500 hover:text-black transition-colors underline decoration-gray-300 underline-offset-4 hover:decoration-black"
             >
               设置 API Key
             </button>
           )}
           <span className="hidden md:inline-flex px-3 py-1 bg-black/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
             VERY GOOD
           </span>
        </div>
      </div>
    </header>
  );
};