import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, color = 'primary', size = 'md', showValue = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const colors = {
      primary: 'bg-green-600',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-600'
    };

    const sizes = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4'
    };

    return (
      <div className={cn('w-full', className)} ref={ref} {...props}>
        {showValue && (
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
        <div className={cn('bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
          <div
            className={cn('h-full transition-all duration-300 ease-out', colors[color])}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';
export default Progress;
