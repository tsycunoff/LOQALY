import { useState, useEffect, useRef } from 'react';

export const useCountUp = (endValue: number, duration: number = 2000): number => {
  const [count, setCount] = useState(0);
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);
  const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const savedEndValue = useRef(endValue);
  const savedCount = useRef(count);

  useEffect(() => {
    savedCount.current = count;
  }, [count]);
  
  useEffect(() => {
    if (savedEndValue.current === endValue) return;
    
    savedEndValue.current = endValue;
    const startValue = savedCount.current;
    
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = easeOutExpo(frame / totalFrames);
      const currentCount = startValue + (endValue - startValue) * progress;
      setCount(currentCount);

      if (frame === totalFrames) {
        clearInterval(counter);
        setCount(endValue);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [endValue, duration, frameRate, totalFrames]);

  return count;
};
