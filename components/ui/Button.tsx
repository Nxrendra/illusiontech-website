import { forwardRef, type ButtonHTMLAttributes } from 'react';

const baseClasses =
  'inline-flex items-center justify-center rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary: 'bg-white text-gray-800 hover:bg-gray-200',
};

const sizes = {
  default: 'py-3 px-4',
  large: 'py-3 px-8 rounded-full text-lg transform hover:scale-105',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${
      className || ''
    }`;

    return (
      <button className={combinedClasses.trim()} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button };

