'use client';

import { useState, useEffect } from 'react';
import './CodeTypeLoader.css';

export const CodeTypeLoader = ({
  text = '// Initializing IllusionTech...',
}: {
  text?: string;
}) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, 80); // Adjust typing speed here (milliseconds)

    return () => clearInterval(intervalId);
  }, [text]);

  return <div className="code-loader-text">{displayedText}</div>;
};

export default CodeTypeLoader;