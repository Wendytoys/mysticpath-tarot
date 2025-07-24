
import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-accent-purple/80 to-accent-gold/80 p-10 sm:p-16 rounded-3xl text-center relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full filter blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full filter blur-xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">Ready to Begin Your Reading?</h2>
            <p className="text-lg text-primary-dark max-w-2xl mx-auto mb-8 font-medium">
              The cards are waiting. Your future is a story yet to be told. Download Mystic Path and take the first step today.
            </p>
            <button className="bg-primary-dark hover:bg-black text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 text-lg shadow-lg">
              Download the App
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
