// components/IntroText.js
import React, { useEffect, useState } from 'react';
import { Text } from '@react-three/drei';

export default function IntroText() {
  const [visibleText, setVisibleText] = useState('');
  const fullText = 'Welcome to Teamopia...';

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setVisibleText((prev) => prev + fullText[i]);
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 100); // character speed

    return () => clearInterval(interval);
  }, []);

  return (
    <Text
      position={[0, 2, -2]}
      fontSize={0.4}
      color="#3a2f1f"
      font="/fonts/Comic_Neue/ComicNeue-Bold.ttf"
      anchorX="center"
      anchorY="middle"
      maxWidth={3}
    >
      {visibleText}
    </Text>
  );
}
