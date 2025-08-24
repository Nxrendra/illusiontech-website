import React from 'react';
import {
  Code,
  Brush,
  Bot,
  LayoutTemplate,
  Server,
  ShieldCheck,
  ShoppingCart,
  Heart,
  Zap,
  BarChart2,
  PenTool,
  LucideProps,
  LucideIcon,
} from 'lucide-react';

export const iconMap: { [key: string]: LucideIcon } = {
  Code,
  Brush,
  Bot,
  LayoutTemplate,
  Server,
  ShieldCheck,
  ShoppingCart,
  Heart,
  Zap,
  BarChart2,
  PenTool,
};

export const iconNames = Object.keys(iconMap);

export const getIcon = (name?: string): React.ReactElement | null => {
  if (!name || !iconMap[name]) {
    // Return a default icon or null if the name is not found
    return <Code />;
  }
  const IconComponent = iconMap[name];
  return <IconComponent />;
};