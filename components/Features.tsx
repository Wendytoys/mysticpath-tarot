
import React, { useEffect, useRef } from 'react';
import type { Feature } from '../types';
import { BookOpen, Star, Sun, Users } from 'lucide-react';

// In a real project, these would be imported from 'gsap'
declare const gsap: any;
declare const ScrollTrigger: any;

const featuresData: Feature[] = [
  {
    icon: <Sun size={32} className="text-accent-gold" />,
    title: 'Daily Readings',
    description: 'Start your day with insight. Pull a card each morning for guidance and reflection on the day ahead.',
  },
  {
    icon: <BookOpen size={32} className="text-accent-gold" />,
    title: 'In-Depth Card Library',
    description: 'Explore the rich symbolism and meanings of all 78 Tarot cards. Perfect for both beginners and experts.',
  },
  {
    icon: <Users size={32} className="text-accent-gold" />,
    title: 'Personalized Spreads',
    description: 'From the classic Celtic Cross to custom spreads you create, find the perfect layout for your questions.',
  },
  {
    icon: <Star size={32} className="text-accent-gold" />,
    title: 'Spiritual Guidance',
    description: 'Our AI-powered interpretations help you understand the cards in the context of your life and spiritual path.',
  },
];

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => (
  <div className="feature-card bg-secondary-dark/50 p-8 rounded-2xl border border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:border-accent-purple hover:shadow-2xl hover:shadow-accent-purple/20 transform hover:-translate-y-2">
    <div className="mb-4 inline-block p-4 bg-primary-dark rounded-full">
      {feature.icon}
    </div>
    <h3 className="text-2xl font-playfair font-bold text-white mb-3">{feature.title}</h3>
    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
  </div>
);

const Features: React.FC = () => {
    const featuresRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".feature-card", {
                scrollTrigger: {
                    trigger: featuresRef.current,
                    start: "top 80%",
                    end: "bottom 80%",
                    toggleActions: "play none none none",
                },
                opacity: 0,
                y: 50,
                stagger: 0.2,
                duration: 0.8,
                ease: "power3.out"
            });
        }, featuresRef);
        return () => ctx.revert();
    }, []);


  return (
    <section id="features" ref={featuresRef} className="py-20 sm:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">Your Path to Inner Wisdom</h2>
          <p className="text-lg text-gray-400">
            Mystic Path is more than an app; it's a companion for your spiritual journey, equipped with powerful tools.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
