export interface ThemeOption {
  name: string;
  gradient: string;
  accentClass: string;
  buttonClass: string;
}

export const themeOptions: ThemeOption[] = [
  {
    name: 'Default',
    gradient: 'from-gray-700 to-gray-900',
    accentClass: 'text-gray-300',
    buttonClass: 'bg-white/10 hover:bg-white/20',
  },
  {
    name: 'Blue',
    gradient: 'from-blue-500 to-blue-700',
    accentClass: 'text-blue-200',
    buttonClass: 'bg-blue-400/50 hover:bg-blue-400/80',
  },
  {
    name: 'Green',
    gradient: 'from-green-500 to-green-700',
    accentClass: 'text-green-200',
    buttonClass: 'bg-green-400/50 hover:bg-green-400/80',
  },
  {
    name: 'Purple',
    gradient: 'from-purple-500 to-purple-700',
    accentClass: 'text-purple-200',
    buttonClass: 'bg-purple-400/50 hover:bg-purple-400/80',
  },
  {
    name: 'Orange',
    gradient: 'from-orange-500 to-orange-700',
    accentClass: 'text-orange-200',
    buttonClass: 'bg-orange-400/50 hover:bg-orange-400/80',
  },
];

export const themeMap = new Map(themeOptions.map(t => [t.name, t]));