import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/25 hover:shadow-primary/40',
  secondary: 'bg-gradient-to-r from-secondary to-secondary-light text-dark-900 shadow-lg shadow-secondary/25 hover:shadow-secondary/40',
  accent: 'bg-gradient-to-r from-accent to-accent-light text-white shadow-lg shadow-accent/25 hover:shadow-accent/40',
  ghost: 'bg-transparent border border-white/10 text-white hover:bg-white/5',
  outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const Button = ({ children, variant = 'primary', size = 'md', className = '', disabled = false, loading = false, icon: Icon, ...props }) => {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-300 ${variants[variant]} ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? <Icon className="w-5 h-5" /> : null}
      {children}
    </motion.button>
  );
};

export default Button;
