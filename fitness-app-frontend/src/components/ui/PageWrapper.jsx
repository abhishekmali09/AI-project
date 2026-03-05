import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

const PageWrapper = ({ children, className = '' }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        transition={pageTransition.transition}
        className={`min-h-screen ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageWrapper;
