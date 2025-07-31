import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center font-medium rounded-full border';
    
    const variants = {
      default: 'bg-gray-100 text-gray-800 border-gray-200',
      success: 'bg-success-100 text-success-800 border-success-200',
      warning: 'bg-warning-100 text-warning-800 border-warning-200',
      danger: 'bg-danger-100 text-danger-800 border-danger-200',
      info: 'bg-medical-100 text-medical-800 border-medical-200'
    };

    const sizes = {
      sm: 'px-2.5 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm'
    };

    return (
      <span
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
export default Badge;
