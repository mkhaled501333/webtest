import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const badgeClasses = cn(
      'inline-flex items-center rounded-full font-medium',
      {
        // Sizes
        'px-2 py-0.5 text-xs': size === 'sm',
        'px-2.5 py-1 text-xs': size === 'md',
        'px-3 py-1.5 text-sm': size === 'lg',
        
        // Variants
        'bg-gray-100 text-gray-800': variant === 'default',
        'bg-primary-100 text-primary-800': variant === 'primary',
        'bg-secondary-100 text-secondary-800': variant === 'secondary',
        'bg-green-100 text-green-800': variant === 'success',
        'bg-yellow-100 text-yellow-800': variant === 'warning',
        'bg-red-100 text-red-800': variant === 'danger',
        'border border-gray-300 text-gray-600 bg-transparent': variant === 'outline',
      },
      className
    );

    return (
      <span ref={ref} className={badgeClasses} {...props} />
    );
  }
);

Badge.displayName = 'Badge';

export default Badge; 