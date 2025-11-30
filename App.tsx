import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { Gallery } from './components/Gallery';
import { Controls } from './components/Controls';
import { FashionItem, Gender, ProcessingStatus } from './types';
import { generateFashionImage } from './services/geminiService';

const App: React.FC = () => {
  const [items, setItems] = useState<FashionItem[]>([]);
  const [gender, setGender] = useState<Gender>(Gender.FEMALE);
  const [remarks, setRemarks] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKeyVerified, setApiKeyVerified] = useState(false);

  // Handle file uploads
  const handleFilesSelected = useCallback((files: File[]) => {
    const newItems: FashionItem[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      originalFile: file,
      previewUrl: URL.createObjectURL(file),
      status: ProcessingStatus.IDLE
    }));
    setItems(prev => [...newItems, ...prev]);
  }, []);

  // Remove item
  const handleRemoveItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // Check API Key
  const checkApiKey = async (): Promise<boolean> => {
    if (apiKeyVerified) return true;
    
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (hasKey) {
            setApiKeyVerified(true);
            return true;
        } else {
             await window.aistudio.openSelectKey();
             setApiKeyVerified(true);
             return true;
        }
    }
    return true; 
  };

  // Explicitly change API Key
  const handleChangeApiKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      setApiKeyVerified(true);
    }
  };

  // Generate logic - Sequential processing to avoid 429 Rate Limits
  const handleGenerate = async () => {
    const pendingItems = items.filter(i => i.status === ProcessingStatus.IDLE || i.status === ProcessingStatus.ERROR);
    if (pendingItems.length === 0) return;

    try {
        await checkApiKey();
    } catch (e) {
        console.error("API Key selection failed", e);
        return;
    }

    setIsProcessing(true);
    const apiKey = process.env.API_KEY || '';

    // Process items one by one (Sequential)
    for (const item of pendingItems) {
      // 1. Mark current item as processing
      setItems(prev => prev.map(i => 
        i.id === item.id 
          ? { ...i, status: ProcessingStatus.PROCESSING, error: undefined } 
          : i
      ));

      try {
        // 2. Call API
        const generatedImage = await generateFashionImage(item.originalFile, gender, remarks, apiKey);
        
        // 3. Mark as completed
        setItems(prev => prev.map(i => 
          i.id === item.id 
            ? { ...i, status: ProcessingStatus.COMPLETED, generatedImageUrl: generatedImage } 
            : i
        ));
      } catch (error: any) {
        console.error(`Error processing item ${item.id}`, error);
        setItems(prev => prev.map(i => 
          i.id === item.id 
            ? { ...i, status: ProcessingStatus.ERROR, error: error.message } 
            : i
        ));
      }

      // 4. Add a small delay between requests to be polite to the API rate limiter
      if (pendingItems.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setIsProcessing(false);
  };

  // Batch Download Logic
  const handleDownloadAll = useCallback(async () => {
    const completedItems = items.filter(item => item.status === ProcessingStatus.COMPLETED && item.generatedImageUrl);
    
    for (let i = 0; i < completedItems.length; i++) {
      const item = completedItems[i];
      if (!item.generatedImageUrl) continue;

      const link = document.createElement('a');
      link.href = item.generatedImageUrl;
      link.download = `yingying_gen_${item.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Small delay to prevent browser from blocking multiple downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }, [items]);

  const hasCompletedItems = items.some(i => i.status === ProcessingStatus.COMPLETED);

  return (
    <div className="min-h-screen pb-12 bg-transparent">
      <Header onApiKeyChange={handleChangeApiKey} />
      
      <main className="container mx-auto max-w-6xl animate-fade-in">
        
        {/* Hero / Upload Section */}
        <section className="px-4 py-8 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight drop-shadow-sm">
             YINGYING高端模特生成
          </h2>
          <p className="max-w-xl mx-auto text-gray-600 text-sm font-medium tracking-wide mb-8 bg-white/40 backdrop-blur-sm py-1 px-4 rounded-full inline-block">
            上传平铺图 · 一键生成 · 杂志级大片
          </p>
          
          <UploadZone onFilesSelected={handleFilesSelected} />
        </section>

        {/* Controls */}
        <Controls 
          gender={gender} 
          setGender={setGender}
          remarks={remarks}
          setRemarks={setRemarks}
          isProcessing={isProcessing}
          onGenerate={handleGenerate}
          hasItems={items.some(i => i.status === ProcessingStatus.IDLE || i.status === ProcessingStatus.ERROR)}
          itemCount={items.length}
          onDownloadAll={handleDownloadAll}
          hasCompletedItems={hasCompletedItems}
        />

        {/* Gallery */}
        <Gallery items={items} onRemove={handleRemoveItem} />

      </main>

       {/* Footer */}
       <footer className="border-t border-white/20 py-8 mt-12 bg-white/30 backdrop-blur-md">
          <div className="text-center text-gray-500 text-xs font-medium">
            <p>&copy; 2025 YINGYING Fashion AI. Powered by Google Gemini 3 Pro.</p>
          </div>
       </footer>
    </div>
  );
};

export default App;