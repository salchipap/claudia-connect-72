
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

type ButtonProps = {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  variant?: 'primary' | 'secondary' | 'outlined' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  href?: string;
  to?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
};

const Button = ({
  onClick,
  type = 'button',
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  href,
  to,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-medium rounded-md transition-all ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-claudia-primary hover:scale-[1.02] active:scale-[0.98]';
  
  const variantStyles = {
    primary: 'bg-claudia-primary text-claudia-white shadow-md hover:bg-opacity-90',
    secondary: 'bg-claudia-secondary text-claudia-foreground shadow-sm hover:bg-opacity-90',
    outlined: 'bg-transparent border-2 border-claudia-primary text-claudia-white hover:bg-claudia-muted',
    ghost: 'bg-transparent text-claudia-white hover:bg-claudia-muted'
  };
  
  const sizeStyles = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3'
  };
  
  const disabledStyles = disabled ? 'opacity-60 cursor-not-allowed' : '';
  const fullWidthStyles = fullWidth ? 'w-full' : '';
  
  const buttonContent = (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      <span className={`flex items-center gap-1.5 ${loading ? 'opacity-0' : ''}`}>
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </span>
    </>
  );
  
  const buttonClasses = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabledStyles,
    fullWidthStyles,
    className
  );
  
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
      >
        {buttonContent}
      </Link>
    );
  }
  
  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
      >
        {buttonContent}
      </a>
    );
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {buttonContent}
    </button>
  );
};

export default Button;
