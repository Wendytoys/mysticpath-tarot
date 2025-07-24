
import React, { useEffect, useRef } from 'react';
import { HelpCircle, VenetianMask, Sparkles } from 'lucide-react';

// In a real project, these would be imported from 'gsap'
declare const gsap: any;
declare const ScrollTrigger: any;

const HowItWorks: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
             gsap.from(".step-card", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
                opacity: 0,
                y: 60,
                stagger: 0.3,
                duration: 1,
                ease: "expo.out"
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

  const steps = [
    {
      icon: <HelpCircle size={32} className="text-accent-purple" />,
      title: 'Pose Your Question',
      description: 'Center your thoughts and focus on an area of your life where you seek clarity.',
    },
    {
      icon: <VenetianMask size={32} className="text-accent-purple" />,
      title: 'Choose a Spread',
      description: 'Select a Tarot spread that aligns with the nature of your inquiry.',
    },
    {
      icon: <Sparkles size={32} className="text-accent-purple" />,
      title: 'Receive Your Reading',
      description: 'Draw your cards and receive an insightful, AI-powered interpretation of their message.',
    },
  ];

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 sm:py-32 bg-secondary-dark/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">Begin Your Journey in 3 Steps</h2>
          <p className="text-lg text-gray-400">
            Getting started with Mystic Path is simple and intuitive.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="step-card text-center p-8">
              <div className="flex items-center justify-center mb-6">
                 <div className="absolute h-20 w-20 bg-accent-purple/10 rounded-full blur-xl"></div>
                 <div className="relative mb-4 inline-block p-5 bg-primary-dark rounded-full border border-accent-purple/30">
                   {step.icon}
                 </div>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
