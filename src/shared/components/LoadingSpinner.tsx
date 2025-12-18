import React from 'react';
import { Loader2 } from 'lucide-react';
import { COLORS } from '../constants';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  className = '',
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin text-[${COLORS.secondary}]`} />
      {message && (
        <p className="mt-2 text-gray-600 font-[Poppins-light]">{message}</p>
      )}
    </div>
  );
};
