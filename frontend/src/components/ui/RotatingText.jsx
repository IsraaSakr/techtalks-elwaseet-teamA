import React, { useState, useEffect } from 'react';

const RotatingText = ({ 
  items = [], 
  interval = 3000,
  className = ""
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, interval]);

  return (
    <span className={`inline-grid h-[1.2em] overflow-hidden align-bottom ${className}`}>
      {items.map((item, i) => (
        <span
          key={i}
          className="col-start-1 col-end-2 row-start-1 row-end-2 flex items-center justify-start transition-all duration-500 ease-in-out"
          style={{
            transform: `translateY(${(i - index) * 100}%)`,
            opacity: i === index ? 1 : 0,
            visibility: Math.abs(i - index) > 1 ? 'hidden' : 'visible' // Optimization
          }}
        >
          {item}
        </span>
      ))}
    </span>
  );
};

export default RotatingText;
