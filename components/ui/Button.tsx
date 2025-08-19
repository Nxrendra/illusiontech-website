import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';

const baseClasses =
  'inline-flex items-center justify-center rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  'outline-light': 'bg-transparent border border-white text-white hover:bg-white hover:text-black',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-accent underline-offset-4 hover:underline',
};

const sizes = {
  default: 'py-3 px-4',
  sm: 'h-9 rounded-md px-3',
  large: 'py-3 px-8 rounded-full text-lg transform hover:scale-105',
  icon: 'h-10 w-10',
  'large-icon': 'h-14 w-14',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${
      className || ''
    }`;

    return (
<Comp className={combinedClasses.trim()} ref={ref} {...props}>
        {children}
      </Comp>    );
  }
);
Button.displayName = 'Button';

export { Button };
