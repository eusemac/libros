'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Type, 
  Image as ImageIcon, 
  Settings, 
  Download, 
  Plus, 
  Layers, 
  Shapes, 
  FileText,
  Save,
  Trash2,
  ChevronRight,
  Maximize2,
  Calculator,
  AlertCircle,
  FileUp,
  History,
  CheckCircle2,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { calculateLayout, PageContent } from '../lib/layout-engine';

const INITIAL_CHAPTERS = [
  { 
    id: 1, 
    title: 'El Comienzo', 
    content: 'En un rincón del mundo donde el tiempo parecía haberse detenido, las palabras comenzaron a tejer una realidad que nadie esperaba. El papel, sediento de tinta, acogió el primer trazo con la devoción de un luthier ante una madera centenaria...\n\nAquella tinta, negra como la noche de los tiempos, no solo trazaba letras; esculpía destinos en la blancura inmaculada de las fibras vegetales. Cada curva de una "S", cada tilde afilada de una "I", era un pulso vital que reclamaba su lugar en la historia.\n\nEl silencio del taller solo se rompía por el siseo de la pluma y el crujir ocasional de las vigas de madera. Afuera, la ciudad rugía con su prisa moderna, ajena a la arquitectura del pensamiento que se fraguaba en este santuario de la letra impresa. El luthier no buscaba la rapidez, buscaba la resonancia. Cada página debía vibrar con la armonía de la proporción áurea, con los márgenes que respiran y la mancha de texto que canta en el centro del escenario blanco.' 
  },
  { 
    id: 2, 
    title: 'La Sombra de la Letra', 
    content: 'Aquel silencio, sin embargo, no era un vacío. Era la espera necesaria para que la estructura del capítulo cobrara vida. Allí, entre los márgenes, se escondían las sombras que darían profundidad a la historia...\n\n¿Quién se atrevería a cruzar el umbral de lo no dicho? La sombra no es ausencia de luz, es la presencia de un cuerpo que interrumpe la infinidad. En la tipografía, el blanco es tan importante como el negro. Es el espacio negativo el que permite que la forma sea legible, que el ojo descanse y que el alma comprenda el peso de la palabra.\n\nLas sombras de las Serifas se alargaban sobre el papel como dedos de un pasado que se niega a ser olvidado. Eran ecos de inscripciones romanas, de manuscritos medievales, de la elegancia industrial de Bodoni. Cada letra lleva consigo la sombra de todos los que la escribieron antes.' 
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('layout'); 
  const [chapters, setChapters] = useState(INITIAL_CHAPTERS);
  const [activeChapterId, setActiveChapterId] = useState(1);
  const [pages, setPages] = useState(156);
  const [gsm, setGsm] = useState(12.4);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [fontSize, setFontSize] = useState(11);
  const [assets, setAssets] = useState<{name: string, url: string}[]>([]);
  const [isKOnly, setIsKOnly] = useState(false);
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0); 

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeChapter = chapters.find(c => c.id === activeChapterId) || chapters[0];
  const spineWidth = (pages * gsm / 100).toFixed(2);

  // Layout engine with full config to avoid lint errors
  const chapterPages = calculateLayout(activeChapter.content, { 
    fontSize, 
    lineHeight: 1.5, 
    margin: 25, 
    pageWidth: 148, 
    pageHeight: 210 
  });
  const totalSpreads = Math.ceil(chapterPages.length / 2);

  const handleUpdateContent = (content: string) => {
    setIsAutoSaving(true);
    setChapters(prev => prev.map(c => c.id === activeChapterId ? { ...c, content } : c));
    setTimeout(() => setIsAutoSaving(false), 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAssets(prev => [...prev, { name: file.name, url }]);
    }
  };

  return (
    <main className={`flex h-screen overflow-hidden text-foreground selection:bg-primary/30 font-sans transition-colors duration-1000 ${
      isKOnly ? 'grayscale brightness-110' : ''
    } ${activeTab === 'manuscrito' ? 'bg-surface-lowest' : 'bg-background'}`}>
      
      {/* 1. Global Header */}
      <header className={`absolute top-0 left-0 right-0 h-16 flex items-center px-6 z-50 justify-between transition-all duration-700 ${
        activeTab === 'manuscrito' ? 'bg-transparent border-none' : 'bg-surface-low/80 backdrop-blur-xl border-b border-outline/10 shadow-sm'
      }`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setActiveTab('layout')}>
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-on-primary font-bold shadow-lg shadow-primary/20">A</div>
            {activeTab !== 'manuscrito' && <h2 className="font-serif text-xl tracking-tight hidden md:block animate-in fade-in">AutoBook Pro</h2>}
          </div>
          
          <nav className={`flex gap-1 p-1 rounded-lg ${activeTab === 'manuscrito' ? 'bg-surface-lowest' : 'bg-surface-lowest/50'}`}>
            {[
              { id: 'manuscrito', label: 'Escribir', icon: FileText },
              { id: 'layout', label: 'Diagramar', icon: Shapes },
              { id: 'assets', label: 'Assets', icon: ImageIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                    : 'text-foreground/40 hover:text-foreground/80'
                }`}
              >
                <tab.icon size={12} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-foreground/30">
            {isAutoSaving ? 'Sincronizando...' : 'Artesanía Segura'}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsKOnly(!isKOnly)} className={`p-2 rounded-full transition-all ${isKOnly ? 'bg-primary text-on-primary' : 'hover:bg-surface-bright text-foreground/60'}`}>
              <Layers size={18} />
            </button>
            <button className="px-5 py-2 bg-foreground text-background rounded-md text-xs font-bold hover:shadow-2xl transition-all active:scale-95">
              EXPORTAR PDF/X-1a
            </button>
          </div>
        </div>
      </header>

      {/* 2. Left Sidebar */}
      <aside className={`w-[280px] bg-surface-low border-r border-outline/10 flex flex-col pt-20 pb-6 px-5 gap-8 overflow-y-auto transition-all duration-700 ${
        activeTab === 'manuscrito' ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}>
        <section className="flex flex-col gap-4">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-foreground/30 font-bold">MANUSCRITO</h3>
          <div className="flex flex-col gap-1">
            {chapters.map((ch) => (
              <button 
                key={ch.id}
                onClick={() => { setActiveChapterId(ch.id); setCurrentSpreadIndex(0); }}
                className={`flex items-center justify-between text-sm text-left px-3 py-2.5 rounded-lg transition-all ${
                  activeChapterId === ch.id ? 'bg-surface-bright shadow-inner border border-outline/5' : 'hover:bg-surface-bright/40 text-foreground/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-primary/40">0{ch.id}</span>
                  <span className="truncate">{ch.title}</span>
                </div>
                <ChevronRight size={14} className="opacity-40" />
              </button>
            ))}
            <button className="flex items-center gap-2 text-[10px] font-bold text-primary/70 hover:text-primary transition-colors px-3 py-4 border-t border-outline/5 mt-2 uppercase tracking-widest">
              <Plus size={12} />
              <span>Nuevo Capítulo</span>
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-foreground/30 font-bold">ASSETS</h3>
            <button onClick={() => fileInputRef.current?.click()} className="p-1.5 hover:bg-primary/20 rounded-md text-primary">
              <Plus size={14} />
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {assets.map((asset, i) => (
              <div key={i} className="aspect-square bg-surface-lowest rounded-lg border border-outline/5 overflow-hidden group shadow-sm">
                 <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
            ))}
            {assets.length === 0 && <div className="col-span-2 py-10 border border-dashed border-outline/10 rounded-xl text-center text-[9px] text-foreground/10 italic">Sin imágenes</div>}
          </div>
        </section>
      </aside>

      {/* 3. Central Canvas */}
      <section className={`flex-1 flex flex-col relative items-center pt-28 pb-20 px-12 overflow-auto scrollbar-hide ${activeTab === 'manuscrito' ? 'max-w-4xl mx-auto' : 'group/canvas'}`}>
        
        {activeTab === 'manuscrito' ? (
          <div className="w-full h-full flex flex-col animate-in fade-in duration-1000 max-w-3xl">
             <input 
               type="text" 
               value={activeChapter.title}
               onChange={(e) => setChapters(prev => prev.map(c => c.id === activeChapterId ? { ...c, title: e.target.value } : c))}
               className="bg-transparent border-none text-5xl font-serif outline-none mb-10 text-foreground/80"
               placeholder="Título..."
             />
             <textarea 
               value={activeChapter.content}
               onChange={(e) => handleUpdateContent(e.target.value)}
               className="flex-1 bg-transparent border-none resize-none outline-none font-serif text-xl leading-relaxed text-foreground/60 focus:text-foreground transition-all duration-500"
               placeholder="Escribe aquí..."
             />
          </div>
        ) : (
          <>
            <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-1 bg-surface-lowest/95 border border-outline/10 p-1.5 rounded-full shadow-2xl backdrop-blur-md opacity-0 translate-y-2 group-hover/canvas:opacity-100 group-hover/canvas:translate-y-0 transition-all duration-500 z-10">
              {[Type, ImageIcon, Shapes, Calculator].map((Icon, i) => (
                <button key={i} className="p-2.5 hover:bg-primary hover:text-on-primary rounded-full transition-all"><Icon size={16} /></button>
              ))}
              <div className="w-[1px] h-4 bg-outline/20 self-center mx-1" />
              <button onClick={() => setActiveTab('manuscrito')} className="px-4 py-1.5 text-[10px] font-bold text-primary hover:bg-primary/5 rounded-full flex items-center gap-2">
                <FileText size={12} /> FOCUS
              </button>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
               <button onClick={() => setCurrentSpreadIndex(i => Math.max(0, i - 1))} className={`p-4 bg-surface-lowest/50 rounded-full text-foreground/20 hover:text-primary pointer-events-auto transition-all ${currentSpreadIndex === 0 ? 'opacity-0' : 'opacity-100'}`}><ArrowLeft size={24} /></button>
               <button onClick={() => setCurrentSpreadIndex(i => Math.min(totalSpreads - 1, i + 1))} className={`p-4 bg-surface-lowest/50 rounded-full text-foreground/20 hover:text-primary pointer-events-auto transition-all ${currentSpreadIndex >= totalSpreads - 1 ? 'opacity-0' : 'opacity-100'}`}><ArrowRight size={24} /></button>
            </div>

            <div className="flex gap-1 relative perspective-2000 transform-gpu animate-in zoom-in-95 duration-1000 select-none">
              <div className="w-[420px] aspect-[148/210] bg-zinc-50 shadow-[-20px_40px_80px_-20px_rgba(0,0,0,0.6)] flex flex-col p-14 text-zinc-900 origin-right transition-all duration-700 relative overflow-hidden group/page hover:rotate-y-[1deg]">
                 <div className="flex-1 overflow-hidden">
                   {currentSpreadIndex === 0 && <h1 className="text-3xl font-serif mb-10 text-zinc-800">{activeChapter.title}</h1>}
                   <p style={{ fontSize: `${fontSize}pt` }} className="leading-relaxed text-zinc-700 whitespace-pre-wrap text-justify">
                     {chapterPages[currentSpreadIndex * 2]?.text || '...'}
                   </p>
                 </div>
              </div>
              <div className="w-[3px] h-full bg-black/30 self-stretch shadow-[0_0_20px_rgba(0,0,0,0.5)] z-10"></div>
              <div className="w-[420px] aspect-[148/210] bg-zinc-50 shadow-[20px_40px_80px_-20px_rgba(0,0,0,0.6)] flex flex-col p-14 text-zinc-900 origin-left transition-all duration-700 relative overflow-hidden hover:rotate-y-[-1deg]">
                 <div className="flex-1 overflow-hidden">
                    <div className="w-full aspect-video bg-zinc-100 border border-zinc-200 rounded-sm mb-6 flex items-center justify-center overflow-hidden">
                       {assets.length > 0 ? <img src={assets[0].url} className="w-full h-full object-cover" alt="asset" /> : <ImageIcon size={24} className="opacity-20" />}
                    </div>
                    <p style={{ fontSize: `${fontSize}pt` }} className="leading-relaxed text-zinc-700 whitespace-pre-wrap text-justify">
                       {chapterPages[currentSpreadIndex * 2 + 1]?.text || 'El contenido fluye aquí...'}
                    </p>
                 </div>
              </div>
            </div>
          </>
        )}

        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-[340px] bg-surface-lowest/90 border border-outline/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md transition-all z-40 border-b-2 border-b-primary ${activeTab === 'manuscrito' ? 'translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}`}>
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2 text-primary font-bold text-sm"><Calculator size={16} /><span>Calculadora de Lomo</span></div>
           </div>
           <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1"><label className="text-[9px] text-foreground/30 font-bold uppercase">Páginas</label><input type="number" value={pages} onChange={(e) => setPages(parseInt(e.target.value) || 0)} className="w-full bg-surface-bright/50 rounded px-3 py-2 text-xs font-mono outline-none" /></div>
              <div className="space-y-1"><label className="text-[9px] text-foreground/30 font-bold uppercase">GSM</label><input type="number" step="0.1" value={gsm} onChange={(e) => setGsm(parseFloat(e.target.value) || 0)} className="w-full bg-surface-bright/50 rounded px-3 py-2 text-xs font-mono outline-none" /></div>
           </div>
           <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 flex items-center justify-between"><span className="text-xs text-primary/60">Ancho</span><span className="text-2xl font-serif font-bold text-primary">{spineWidth}mm</span></div>
        </div>
      </section>

      {/* 4. Right Sidebar */}
      <aside className={`w-[340px] bg-surface-low border-l border-outline/10 pt-20 pb-6 px-6 flex flex-col gap-8 overflow-y-auto transition-all duration-700 ${activeTab === 'manuscrito' ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
        <section className="flex flex-col gap-5">
           <h3 className="text-[10px] uppercase tracking-[0.2em] text-foreground/30 font-bold">PRECISIÓN</h3>
           <div className="bg-surface/50 p-5 rounded-2xl border border-outline/10 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold"><span>MÁRGENES</span><span className="text-primary">25mm</span></div>
              <div className="h-2 bg-outline/10 rounded-full overflow-hidden"><div className="h-full bg-primary/40 w-[40%]"></div></div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                 <button className="py-3 bg-surface-lowest border border-outline/5 rounded-xl text-[10px] font-bold hover:border-primary/50 transition-all">SANGRÍA</button>
                 <button className="py-3 bg-surface-lowest border border-outline/5 rounded-xl text-[10px] font-bold hover:border-primary/50 transition-all">ESTILO</button>
              </div>
           </div>
        </section>

        <section className="flex flex-col gap-5">
           <h3 className="text-[10px] uppercase tracking-[0.2em] text-foreground/30 font-bold">TIPOGRAFÍA</h3>
           <div className="space-y-6">
              <div className="flex flex-col gap-2"><label className="text-[9px] text-foreground/40 font-bold uppercase">Fuente</label><select className="bg-surface-lowest border border-outline/10 rounded-xl px-4 py-3 text-xs appearance-none"><option>Noto Serif (A5 Standard)</option></select></div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2"><label className="text-[9px] text-foreground/40 font-bold uppercase">Tamaño</label><div className="flex items-center bg-surface-lowest border border-outline/10 rounded-xl p-1"><button onClick={() => setFontSize(Math.max(8, fontSize-1))} className="w-8 h-8 text-sm">-</button><span className="flex-1 text-center font-mono font-bold text-primary">{fontSize}</span><button onClick={() => setFontSize(Math.min(24, fontSize+1))} className="w-8 h-8 text-sm">+</button></div></div>
                 <div className="space-y-2"><label className="text-[9px] text-foreground/40 font-bold uppercase">Leading</label><div className="flex items-center bg-surface-lowest border border-outline/10 rounded-xl p-1"><button className="w-8 h-8 text-sm">-</button><span className="flex-1 text-center font-mono font-bold text-primary">1.5</span><button className="w-8 h-8 text-sm">+</button></div></div>
              </div>
              <div className="flex gap-1 bg-surface-lowest border border-outline/10 rounded-xl p-1">
                {['L','C','R'].map(a => <button key={a} className="flex-1 py-2 text-xs opacity-40 hover:opacity-100">{a}</button>)}
                <button className="flex-1 py-2 bg-primary/20 text-primary rounded-lg font-bold text-xs ring-1 ring-primary/30">J</button>
              </div>
           </div>
        </section>

        <section className="mt-auto bg-red-400/5 border border-red-500/10 rounded-2xl p-5 flex gap-4 animate-pulse">
           <AlertCircle size={20} className="text-red-400" />
           <div className="space-y-1"><h4 className="text-[10px] font-bold uppercase text-red-300 tracking-wider">PRE-PRENSA</h4><p className="text-[10px] text-red-200/50 leading-snug">Assets: Baja resolución detectada.</p></div>
        </section>
      </aside>
    </main>
  );
}
