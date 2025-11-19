import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "py-3 px-6 rounded-lg font-display font-bold tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-neon-blue to-blue-600 text-white hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] border border-transparent",
    secondary: "bg-neon-panel border border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10 hover:border-neon-purple",
    danger: "bg-red-600 text-white hover:bg-red-700 border border-transparent",
    outline: "bg-transparent border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};