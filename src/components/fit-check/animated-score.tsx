'use client';

import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

interface AnimatedScoreProps {
  value: number;
}

export function AnimatedScore({ value }: AnimatedScoreProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [value]);

  return <span>{display}</span>;
}
