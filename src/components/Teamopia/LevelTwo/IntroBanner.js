// components/IntroBanner.js
import React, { useEffect } from 'react';
import ScrollIntro from './ScrollIntro';
import IntroText from './IntroText';

export default function IntroBanner({ onDone }) {
  useEffect(() => {
    const utterance = new SpeechSynthesisUtterance('Welcome to Teamopia...');
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.voice = speechSynthesis.getVoices().find(v => v.name.includes('Google') || v.name.includes('UK'));
    speechSynthesis.speak(utterance);

    const timer = setTimeout(() => {
      if (onDone) onDone(); // signal to move on
    }, 6000);

    return () => {
      speechSynthesis.cancel(); // clean up if unmounted
      clearTimeout(timer);
    };
  }, [onDone]);

  return (
    <>
      <ScrollIntro />
      <IntroText />
    </>
  );
}
