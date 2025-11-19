import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-neon-panel/80 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl ${className}`}>
      {title && (
        <h2 className="text-xl font-display font-bold text-white mb-4 border-b border-white/10 pb-2">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};