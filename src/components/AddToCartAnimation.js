import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AddToCartAnimation = ({ isVisible, startPosition, endPosition }) => {
  if (!startPosition || !endPosition) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{
            scale: 1,
            x: startPosition.x,
            y: startPosition.y,
            opacity: 1
          }}
          animate={{
            scale: 0.5,
            x: endPosition.x,
            y: endPosition.y,
            opacity: 0
          }}
          exit={{ opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.7
          }}
          style={{
            position: 'fixed',
            zIndex: 9999,
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: '#ffd700',
            pointerEvents: 'none'
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default AddToCartAnimation;
