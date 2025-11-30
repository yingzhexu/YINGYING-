import React from 'react';
import { FashionItem, ProcessingStatus } from '../types';

interface GalleryProps {
  items: FashionItem[];
  onRemove: (id: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ items, onRemove }) => {
  if (items.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8 mb-20">
      {/* Grid Layout: 1 column on mobile, 2 columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="relative glass-card rounded-2xl overflow-hidden group animate-slide-up flex flex-col md:flex-row lg:flex-row h-auto md:h-[500px] lg:h-[700px]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            
            {/* Remove Button - iOS Style */}
            <button 
              onClick={() => onRemove(item.id)}
              className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md"
              title="删除"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Input Side */}
            <div className="relative w-full md:w-1/2 lg:w-1/2 h-[400px] md:h-full lg:h-full bg-gradient-to-br from-gray-50 to-gray-200/50 p-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/20">
              <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-gray-800 uppercase shadow-sm border border-white/40 z-10">Original</div>
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={item.previewUrl} 
                  alt="Original" 
                  className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-xl" 
                />
              </div>
            </div>

            {/* Output Side */}
            <div className="relative w-full md:w-1/2 lg:w-1/2 h-[400px] md:h-full lg:h-full bg-white/40 flex items-center justify-center">
              <div className="absolute top-3 left-3 z-20">
                 {item.status === ProcessingStatus.COMPLETED && (
                    <span className="bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase animate-scale-in shadow-lg">
                      YINGYING AI
                    </span>
                 )}
                 {item.status === ProcessingStatus.ERROR && (
                    <span className="bg-red-500/10 backdrop-blur-md text-red-600 border border-red-500/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase animate-scale-in">
                      Failed
                    </span>
                 )}
              </div>

              {item.status === ProcessingStatus.IDLE && (
                <div className="text-center text-gray-500/60">
                  <span className="block mb-4 text-4xl opacity-40">✨</span>
                  <p className="text-sm font-medium tracking-wide">等待生成...</p>
                </div>
              )}

              {item.status === ProcessingStatus.PROCESSING && (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="relative w-12 h-12 mb-4">
                     <div className="absolute inset-0 border-2 border-gray-200/50 rounded-full"></div>
                     <div className="absolute inset-0 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm text-gray-800 font-bold animate-pulse tracking-wide mb-1">正在设计场景...</p>
                  <p className="text-xs text-gray-500">AI 正在构思光影与构图</p>
                </div>
              )}

              {item.status === ProcessingStatus.COMPLETED && item.generatedImageUrl && (
                <div className="w-full h-full relative group/image overflow-hidden bg-gray-50/30 flex items-center justify-center">
                   {/* Changed to object-contain to ensure full image visibility */}
                   <img 
                    src={item.generatedImageUrl} 
                    alt="Generated" 
                    className="max-w-full max-h-full w-auto h-auto object-contain shadow-2xl" 
                  />
                  
                  {/* Hover Actions */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover/image:opacity-100 transition-all duration-300 flex justify-center items-end transform translate-y-4 group-hover/image:translate-y-0">
                     <a 
                      href={item.generatedImageUrl} 
                      download={`yingying_gen_${item.id}.png`}
                      className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold hover:bg-gray-100 shadow-xl flex items-center gap-2 transform hover:scale-105 transition-all"
                     >
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 12 12 16.5m0 0 4.5-4.5M12 16.5v-9" />
                       </svg>
                       保存高清大图
                     </a>
                  </div>
                </div>
              )}

              {item.status === ProcessingStatus.ERROR && (
                <div className="text-center px-6 max-w-sm">
                  <div className="w-10 h-10 bg-red-50/80 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-3 border border-red-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                      </svg>
                  </div>
                  <p className="text-gray-900 font-bold text-sm mb-1">生成中断</p>
                  <p className="text-xs text-gray-500 leading-relaxed bg-white/60 p-3 rounded-lg border border-white/40">{item.error || '网络连接不稳定，请重试'}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};