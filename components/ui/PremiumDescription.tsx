'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumDescriptionProps {
  text: string;
  clampLines?: number;
  className?: string;
}

export function PremiumDescription({ text, clampLines = 3, className }: PremiumDescriptionProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const isLongText = text.split('\n').length > clampLines || text.length > 160;

  // Prevent body scroll when the premium overlay is open
  useEffect(() => {
    if (showOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showOverlay]);

  return (
    <>
      <div className={cn("group relative flex flex-col", className)}>
        <div className="relative overflow-hidden">
          <p
            className="whitespace-pre-line leading-relaxed text-muted-foreground transition-all duration-500 line-clamp-3"
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Animated Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOverlay(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />

            {/* Floating Glass Pane */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden bg-gray-950/40 border border-white/10 rounded-3xl backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
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
              <div className="p-8 sm:p-10 overflow-y-auto custom-scrollbar">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-lg sm:text-xl leading-relaxed text-gray-200 whitespace-pre-line font-medium italic mb-4">
                    "{text.split('\n')[0]}"
                  </p>
                  <div className="h-px w-12 bg-primary/50 mb-6" />
                  <p className="text-base sm:text-lg leading-relaxed text-gray-400 whitespace-pre-line">
                    {text}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}