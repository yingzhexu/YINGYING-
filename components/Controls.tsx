import React from 'react';
import { Gender } from '../types';

interface ControlsProps {
  gender: Gender;
  setGender: (g: Gender) => void;
  remarks: string;
  setRemarks: (r: string) => void;
  isProcessing: boolean;
  onGenerate: () => void;
  hasItems: boolean;
  itemCount: number;
  onDownloadAll: () => void;
  hasCompletedItems: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ 
  gender, 
  setGender, 
  remarks,
  setRemarks,
  isProcessing, 
  onGenerate,
  hasItems,
  itemCount,
  onDownloadAll,
  hasCompletedItems
}) => {
  return (
    <div className="sticky top-[80px] z-40 max-w-5xl mx-auto mt-6 animate-slide-up">
      <div className="mx-4 md:mx-0 p-2.5 rounded-2xl glass shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row items-center justify-between gap-3 transition-all duration-300">
      
        {/* Settings Group */}
        <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
          
          {/* Gender Selection - Segmented Control Style */}
          <div className="flex bg-gray-100/50 p-1 rounded-xl shrink-0 backdrop-blur-sm border border-black/5 w-full md:w-auto justify-between md:justify-start">
            {[
              { label: '女模', value: Gender.FEMALE },
              { label: '男模', value: Gender.MALE },
              { label: '女童', value: Gender.GIRL },
              { label: '男童', value: Gender.BOY }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setGender(option.value)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ease-out ${
                  gender === option.value 
                    ? 'bg-white text-black shadow-md scale-100 ring-1 ring-black/5' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Remarks Input - Pill Shape */}
          <div className="w-full md:w-72 relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 group-focus-within:text-gray-600 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
            </div>
            <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="添加备注 (例如: 街拍, 居家, 白色背景)"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white focus:border-transparent transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          {hasCompletedItems && (
              <button
                  onClick={onDownloadAll}
                  className="h-10 px-5 rounded-xl text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-sm active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 12 12 16.5m0 0 4.5-4.5M12 16.5v-9" />
                  </svg>
                  全部下载
              </button>
          )}

          <button
            onClick={onGenerate}
            disabled={!hasItems || isProcessing}
            className={`h-10 px-8 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm whitespace-nowrap active:scale-95
              ${!hasItems || isProcessing 
                ? 'bg-gray-400 cursor-not-allowed shadow-none opacity-70' 
                : 'bg-black hover:bg-gray-900 hover:shadow-xl hover:shadow-black/20'
              }`}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                正在构思...
              </>
            ) : (
              <>
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                开始生成 ({itemCount})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};