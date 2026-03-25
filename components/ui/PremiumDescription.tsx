'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumDescriptionProps {
  text: string;
  clampLines?: number;
  className?: string;
}

export function PremiumDescription({ text, clampLines = 3, className }: PremiumDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = text.split('\n').length > clampLines || text.length > 160;

  return (
    <div className={cn("group relative flex flex-col", className)}>
      <div className="relative overflow-hidden">
        <motion.p
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 'auto' }} // Controlled by line-clamp
          className={cn(
            "whitespace-pre-line leading-relaxed text-muted-foreground transition-all duration-500",
            !isExpanded && `line-clamp-${clampLines}`
          )}
          style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: isExpanded ? 'unset' : clampLines }}
        >
          {text}
        </motion.p>
        
        {/* Premium Fade Effect */}
        {!isExpanded && isLongText && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none" />
        )}
      </div>

      {isLongText && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60 hover:text-primary transition-all self-start"
        >
          {isExpanded ? 'Show Less' : 'Read More'}
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      )}
    </div>
  );
}