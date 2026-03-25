'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Info, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumDescriptionProps {
  text: string;
  clampLines?: number;
  className?: string;
}

export function PremiumDescription({ text, clampLines = 3, className }: PremiumDescriptionProps) {
  const [showOverlay, setShowOverlay] = useState(false);

  // Split into lines and filter empty ones to manage spacing better
  const allLines = text.split('\n').filter(line => line.trim() !== '');
  const isLongText = allLines.length > clampLines || text.length > 160;
  
  const firstLine = allLines[0] || '';
  // Use double newlines for the expanded view to give it a "Premium" breathable layout
  const remainingText = allLines.slice(1).join('\n\n');

  return (
    <>
      <div className={cn("group flex flex-col", className)}>
        <div className="relative overflow-hidden">
          <p
            className="whitespace-pre-wrap leading-relaxed text-slate-600 dark:text-muted-foreground transition-all duration-500 text-sm sm:text-base"
            style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: clampLines }}
          >
            {text}
          </p>
          
          {/* Premium Fade Effect */}
          {isLongText && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-background via-white/50 dark:via-background/50 to-transparent pointer-events-none" />
          )}
        </div>

        {isLongText && (
          <button
            onClick={() => setShowOverlay(true)}
            className="mt-2 flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60 hover:text-primary transition-all self-start group/btn"
          >
            Read Full Overview
            <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* The Premium Glass Overlay */}
      <AnimatePresence>
        {showOverlay && (
          /* This absolute container now fills the nearest 'relative' parent (the project card) */
          <div className="absolute inset-0 z-[60] flex flex-col overflow-hidden rounded-xl pointer-events-auto shadow-2xl">
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOverlay(false)}
              className="absolute inset-0 bg-white/95 dark:bg-gray-950/90 backdrop-blur-2xl"
            />

            {/* Glass Pane Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative h-full w-full flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white/90">Full Overview</h4>
                </div>
                <button 
                  onClick={() => setShowOverlay(false)}
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Area */}
              <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {firstLine && (
                    <p className="text-lg sm:text-xl leading-relaxed text-slate-900 dark:text-gray-200 whitespace-pre-wrap font-serif italic mb-6">
                      "{firstLine}"
                    </p>
                  )}
                  
                  {remainingText && (
                    <p className="text-base sm:text-lg leading-loose text-slate-600 dark:text-gray-400 whitespace-pre-wrap tracking-tight">
                      {remainingText}
                    </p>
                  )}
                  
                  {/* Read Less / Close Button at bottom of text */}
                  <button
                    onClick={() => setShowOverlay(false)}
                    className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary hover:text-white transition-all py-2 px-4 rounded-full border border-primary/20 hover:border-primary/50 bg-primary/5"
                  >
                    <ArrowUp className="w-3 h-3" />
                    Close Overview
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}