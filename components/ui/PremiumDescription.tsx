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

  const lines = text.split('\n').filter(line => line.trim() !== '');
  const isLongText = lines.length > clampLines || text.length > 160;
  
  const firstLine = lines[0] || '';
  // Ensures that paragraphs have consistent double-spacing even if entered as single lines
  const remainingText = lines.slice(1).join('\n\n');

  return (
    <>
      <div className={cn("group relative flex flex-col", className)}>
        <div className="relative overflow-hidden">
          <p
            className="whitespace-pre-wrap leading-relaxed text-muted-foreground transition-all duration-500 line-clamp-3"
            style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: clampLines }}
          >
            {text}
          </p>
          
          {/* Premium Fade Effect */}
          {isLongText && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
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
          /* Using inset-0 with absolute ensures it fills the card without growing it */
          <div className="absolute inset-0 z-[60] flex flex-col overflow-hidden rounded-xl pointer-events-auto">
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOverlay(false)}
              className="absolute inset-0 bg-gray-950/80 backdrop-blur-2xl"
            />

            {/* Glass Pane Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="relative h-full w-full flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-white/90">Project Details</h4>
                </div>
                <button 
                  onClick={() => setShowOverlay(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all"
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
                    <p className="text-base sm:text-lg leading-relaxed text-gray-200 whitespace-pre-wrap font-medium italic mb-4">
                      "{firstLine}"
                    </p>
                  )}
                  <div className="h-px w-12 bg-primary/50 mb-6" />
                  <p className="text-sm sm:text-base leading-relaxed text-gray-400 whitespace-pre-wrap">
                    {remainingText || text}
                  </p>
                  
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