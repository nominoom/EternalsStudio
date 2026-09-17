'use client';

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { 
  MessageSquare, 
  X, 
  Minus, 
  GripHorizontal, 
  RotateCcw, 
  Sparkles
} from 'lucide-react';

export default function TawkWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; boxX: number; boxY: number } | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const savedPos = localStorage.getItem('eternals_support_pos');
      if (savedPos) {
        const parsed = JSON.parse(savedPos);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          if (
            parsed.x >= 0 &&
            parsed.x <= window.innerWidth - 100 &&
            parsed.y >= 0 &&
            parsed.y <= window.innerHeight - 100
          ) {
            setPosition(parsed);
          }
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleStartDrag = (clientX: number, clientY: number) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    dragStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      boxX: rect.left,
      boxY: rect.top,
    };
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;
      const cardWidth = cardRef.current?.offsetWidth || 380;
      const cardHeight = cardRef.current?.offsetHeight || 540;

      const newX = Math.max(8, Math.min(window.innerWidth - cardWidth - 8, dragStartRef.current.boxX + deltaX));
      const newY = Math.max(8, Math.min(window.innerHeight - cardHeight - 8, dragStartRef.current.boxY + deltaY));
      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragStartRef.current || !e.touches[0]) return;
      const deltaX = e.touches[0].clientX - dragStartRef.current.mouseX;
      const deltaY = e.touches[0].clientY - dragStartRef.current.mouseY;
      const cardWidth = cardRef.current?.offsetWidth || 380;
      const cardHeight = cardRef.current?.offsetHeight || 540;

      const newX = Math.max(8, Math.min(window.innerWidth - cardWidth - 8, dragStartRef.current.boxX + deltaX));
      const newY = Math.max(8, Math.min(window.innerHeight - cardHeight - 8, dragStartRef.current.boxY + deltaY));
      setPosition({ x: newX, y: newY });
    };

    const handleEndDrag = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEndDrag);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEndDrag);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEndDrag);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEndDrag);
    };
  }, [isDragging]);

  // Persist position when dragging stops
  useEffect(() => {
    if (!isDragging && position) {
      try {
        localStorage.setItem('eternals_support_pos', JSON.stringify(position));
      } catch {}
    }
  }, [isDragging, position]);

  const resetPosition = () => {
    setPosition(null);
    try {
      localStorage.removeItem('eternals_support_pos');
    } catch {}
  };

  return (
    <>
      {/* Floating Launcher Button when collapsed */}
      <div
        className={`fixed bottom-6 right-6 z-[99998] transition-all duration-300 ${
          isOpen ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto'
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-teal-500/25 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
          aria-label="Open Customer Support Chat"
          title="Chat with Customer Support"
        >
          <div className="relative h-6 w-6 rounded-full overflow-hidden border border-white/50 shadow-xs flex-shrink-0">
            <img src="/eternals-logo.jpg" alt="Support" className="w-full h-full object-cover" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 border border-white"></span>
            </span>
          </div>
          <span className="hidden sm:inline tracking-wide font-extrabold">Support Chat</span>
        </button>
      </div>

      {/* Floating Collapsible & Draggable Chat Window */}
      <div
        ref={cardRef}
        style={
          position
            ? {
                left: `${position.x}px`,
                top: `${position.y}px`,
                right: 'auto',
                bottom: 'auto',
              }
            : undefined
        }
        className={`fixed ${
          !position ? 'bottom-4 right-4 sm:bottom-6 sm:right-6' : ''
        } z-[99999] w-[calc(100vw-2rem)] sm:w-[380px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-opacity duration-200 ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-90 pointer-events-none select-none'
        } ${isDragging ? 'shadow-teal-500/20 ring-2 ring-teal-500/40' : ''}`}
      >
        {/* Custom Draggable Header */}
        <div
          onMouseDown={(e) => {
            if ((e.target as HTMLElement).closest('button')) return;
            handleStartDrag(e.clientX, e.clientY);
          }}
          onTouchStart={(e) => {
            if ((e.target as HTMLElement).closest('button')) return;
            if (e.touches[0]) handleStartDrag(e.touches[0].clientX, e.touches[0].clientY);
          }}
          className={`px-3.5 py-2.5 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between select-none border-b border-slate-800 ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          title="Click and drag to move chat window anywhere on screen"
        >
          <div className="flex items-center gap-2 min-w-0">
            <GripHorizontal size={16} className="text-slate-400 flex-shrink-0" />
            <div className="h-5 w-5 rounded-md overflow-hidden border border-teal-500/40 flex-shrink-0">
              <img src="/eternals-logo.jpg" alt="Eternals" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-extrabold text-xs tracking-wider uppercase text-slate-100 truncate">
                Customer Support
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {position && (
              <button
                type="button"
                onClick={resetPosition}
                title="Reset to bottom-right corner"
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-teal-400 transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              title="Minimize chat"
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <Minus size={14} />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              title="Close chat"
              className="p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Embedded Tawk Chat Container (Kept in DOM so iframe remains connected) */}
        <div className="w-full h-[460px] sm:h-[500px] bg-slate-50 dark:bg-slate-900 relative">
          <div id="tawk_6a83c98f273ff73441178fb6" className="w-full h-full" />
        </div>
      </div>

      {/* Tawk.to Embedded Script Configuration */}
      <Script id="tawk-init" strategy="afterInteractive">
        {`
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          Tawk_API.embedded='tawk_6a83c98f273ff73441178fb6';
        `}
      </Script>
      <Script
        id="tawk-script"
        src="https://embed.tawk.to/6a83c98f273ff73441178fb6/1k09dlj5s"
        strategy="afterInteractive"
        crossOrigin={"*" as any}
      />
    </>
  );
}
