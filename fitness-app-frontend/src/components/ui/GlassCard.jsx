import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hover = true, glow = '', onClick, ...props }) => {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover ? {
    whileHover: { scale: 1.02, y: -4 },
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  } : {};

  return (
    <Component
      className={`glass-card p-6 transition-all duration-300 ${glow} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GlassCard;
