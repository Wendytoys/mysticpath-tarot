
import React from 'react';
import type { Testimonial } from '../types';
import { StarIcon } from './StarIcon';

const testimonialsData: Testimonial[] = [
  {
    avatar: 'https://picsum.photos/id/1027/100/100',
    name: 'Elara Vance',
    title: 'Spiritual Seeker',
    quote: 'This app has become a daily ritual. The insights are scarily accurate and have brought so much clarity to my life. It feels like having a wise friend in my pocket.',
    rating: 5,
  },
  {
    avatar: 'https://picsum.photos/id/1011/100/100',
    name: 'Jaxon Reed',
    title: 'Creative Professional',
    quote: 'As someone new to Tarot, Mystic Path was the perfect entry point. The card library is fantastic, and the readings are easy to understand but deeply profound.',
    rating: 5,
  },
   {
    avatar: 'https://picsum.photos/id/1012/100/100',
    name: 'Seraphina Moon',
    title: 'Yoga Instructor',
    quote: 'I recommend this to all my students. It’s a beautiful tool for self-reflection and complements a mindful lifestyle perfectly. The design is just stunning!',
    rating: 5,
  },
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <div className="bg-secondary-dark/50 p-8 rounded-2xl border border-gray-700/50 backdrop-blur-sm h-full flex flex-col">
    <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-accent-gold' : 'text-gray-600'}`} />
        ))}
    </div>
    <p className="text-gray-300 leading-relaxed mb-6 flex-grow">"{testimonial.quote}"</p>
    <div className="flex items-center">
      <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 border-2 border-accent-purple" />
      <div>
        <h4 className="font-bold text-white">{testimonial.name}</h4>
        <p className="text-sm text-gray-400">{testimonial.title}</p>
      </div>
    </div>
  </div>
);

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 sm:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">Echoes from the Community</h2>
          <p className="text-lg text-gray-400">
            See how Mystic Path has guided others on their journey of self-discovery.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
