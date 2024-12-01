import { useState, useCallback } from 'react';

const useAddToCartAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationConfig, setAnimationConfig] = useState({
    startPosition: { x: 0, y: 0 },
    endPosition: { x: 0, y: 0 }
  });

  const startAnimation = useCallback((startElement, cartElement) => {
    if (!startElement || !cartElement) return;

    const startRect = startElement.getBoundingClientRect();
    const cartRect = cartElement.getBoundingClientRect();

    const startPosition = {
      x: startRect.left + startRect.width / 2,
      y: startRect.top + startRect.height / 2
    };

    const endPosition = {
      x: cartRect.left + cartRect.width / 2,
      y: cartRect.top + cartRect.height / 2
    };

    setAnimationConfig({ startPosition, endPosition });
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  }, []);

  return {
    isAnimating,
    startAnimation,
    animationConfig
  };
};

export default useAddToCartAnimation;
