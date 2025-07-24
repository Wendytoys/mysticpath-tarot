import React, { useEffect, useRef } from 'react';
import { TarotDeck } from './TarotDeck';
import { Heart } from 'lucide-react';

// In a real project, these would be imported from 'gsap'
declare const gsap: any;

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".hero-title", { opacity: 0, y: 50, duration: 1, ease: 'power3.out' })
        .from(".hero-subtitle", { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, "-=0.7")
        .from(".tarot-deck-container", { opacity: 0, y: 50, duration: 1.2, ease: 'power3.out' }, "-=0.5");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
       <div className="absolute inset-0 bg-gradient-to-b from-primary-dark via-secondary-dark to-primary-dark opacity-80"></div>
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>

      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center">
        <h1 className="hero-title text-5xl md:text-7xl font-playfair font-bold text-white leading-tight mb-4">
          Unveil Your Destiny
        </h1>
        <p className="hero-subtitle text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Draw from the deck for a classic Tarot reading, then discuss your results with our AI-powered spiritual guide.
        </p>
        
        <div className="tarot-deck-container w-full mt-8">
          <TarotDeck />
        </div>
      </div>
    </section>
  );
};

export default Hero;
