
import React, { useState, useCallback } from 'react';
import { Sparkles, Trash2, Camera, User, Palette, ChevronRight, Loader2, Info } from 'lucide-react';
import { CharacterAttributes, GeneratedImage } from './types';
import { generateFPECharacter } from './services/geminiService';

const DEFAULT_DESCRIPTION = "Артём — 17-летний парень, ростом примерно 179-181 см. Он носит бледно-зелёную футболку оверсайз до бёдер, чёрные широкие трико и чёрные кроссовки. На его лице виден только один глаз — угловатый, с зелёной радужкой и чёрным зрачком. Руки чёрные и угловатые. У него белые волосы и чёрные острые пальцы. Ноги у него длинные — 2,5 метра. Голова отделена от шеи. Поведение как у гангстера из гетто, участник банды Гроув-стрит.";

export default function App() {
  const [attributes, setAttributes] = useState<CharacterAttributes>({
    description: DEFAULT_DESCRIPTION,
    pose: "Стоит в расслабленной гангстерской позе, руки в карманах или сложены на груди",
    emotion: "Уверенная, слегка дерзкая улыбка"
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const imageUrl = await generateFPECharacter(
        attributes.description,
        attributes.pose,
        attributes.emotion
      );
      if (imageUrl) {
        setResultImage({ url: imageUrl, timestamp: Date.now() });
      } else {
        setError("Не удалось получить изображение от модели.");
      }
    } catch (err: any) {
      setError(err?.message || "Произошла ошибка при генерации.");
      if (err?.message?.includes("Requested entity was not found")) {
        // This is where we'd handle the specialized API key logic if needed, 
        // but for standard gemini-2.5-flash-image we assume process.env.API_KEY is working.
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setAttributes({
      description: DEFAULT_DESCRIPTION,
      pose: "Стоит в расслабленной гангстерской позе, руки в карманах или сложены на груди",
      emotion: "Уверенная, слегка дерзкая улыбка"
    });
    setResultImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <header className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold fpe-font text-white tracking-wider">
            FPE <span className="text-emerald-400">STUDIO</span>
          </h1>
          <p className="text-gray-400 mt-1 flex items-center gap-2">
            <Palette size={16} /> Создание персонажей в стиле Fundamental Paper Education
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors border border-gray-700"
          >
            <Trash2 size={16} /> Сбросить
          </button>
        </div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-gray-800 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User size={20} className="text-emerald-400" /> Параметры персонажа
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Описание внешности</label>
                <textarea 
                  value={attributes.description}
                  onChange={(e) => setAttributes({...attributes, description: e.target.value})}
                  className="w-full h-40 bg-black/40 border border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Опишите персонажа, его одежду и особенности..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Поза</label>
                  <input 
                    type="text"
                    value={attributes.pose}
                    onChange={(e) => setAttributes({...attributes, pose: e.target.value})}
                    className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="Например: Прыгает, Сидит, Атакует..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Эмоция</label>
                  <input 
                    type="text"
                    value={attributes.emotion}
                    onChange={(e) => setAttributes({...attributes, emotion: e.target.value})}
                    className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="Например: Ярость, Удивление, Скука..."
                  />
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !attributes.description}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg ${
                  isGenerating 
                  ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-[1.02]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Рисуем персонажа...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Сгенерировать Арт
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-900/30 flex gap-3 text-sm text-blue-200">
            <Info className="flex-shrink-0" size={18} />
            <p>
              Стиль <strong>FPE</strong> отличается угловатостью, длинными ногами и отделенной головой. Изображение будет преимущественно черно-белым.
            </p>
          </div>
        </div>

        {/* Display Panel */}
        <div className="lg:col-span-7">
          <div className="relative aspect-[9/16] w-full max-w-md mx-auto bg-zinc-900 rounded-2xl border-2 border-dashed border-gray-800 flex items-center justify-center overflow-hidden shadow-2xl group">
            {resultImage ? (
              <>
                <img 
                  src={resultImage.url} 
                  alt="Generated Character" 
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={resultImage.url} 
                    download="fpe_character.png"
                    className="p-3 bg-black/60 hover:bg-black/80 rounded-full backdrop-blur-md border border-white/10 transition-transform active:scale-95"
                  >
                    <Camera size={20} className="text-white" />
                  </a>
                </div>
              </>
            ) : isGenerating ? (
              <div className="flex flex-col items-center gap-4 text-gray-500 p-8 text-center">
                <Loader2 size={48} className="animate-spin text-emerald-500" />
                <div>
                  <p className="font-semibold text-lg text-gray-300">Создаем чертеж...</p>
                  <p className="text-sm">Используем бумагу и карандаш в стиле Katieee</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-gray-500 p-8 text-center">
                <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center">
                  <User size={40} className="opacity-20" />
                </div>
                <div>
                  <p className="font-semibold">Персонаж еще не создан</p>
                  <p className="text-sm">Настройте параметры слева и нажмите кнопку генерации</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="absolute inset-x-0 top-0 m-4 p-3 bg-red-900/80 border border-red-500 text-red-100 text-xs rounded-lg backdrop-blur-sm">
                Ошибка: {error}
              </div>
            )}
          </div>

          {resultImage && !isGenerating && (
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm italic">
                Сгенерировано в {new Date(resultImage.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-12 text-gray-600 text-xs text-center border-t border-gray-800 w-full max-w-4xl pt-8 pb-4">
        <p>&copy; 2024 FPE Character Generator. Inspired by Katieee & Fundamental Paper Education.</p>
      </footer>
    </div>
  );
}
