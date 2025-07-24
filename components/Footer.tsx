
import React from 'react';
import { Logo } from './Logo';
import { Twitter, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: <Twitter size={20} />, href: '#' },
    { icon: <Instagram size={20} />, href: '#' },
    { icon: <Facebook size={20} />, href: '#' },
  ];

  return (
    <footer className="bg-secondary-dark/30 border-t border-gray-800/50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center gap-2">
            <Logo className="h-7 w-7 text-accent-gold" />
            <span className="text-lg font-playfair font-bold text-white">Mystic Path</span>
          </div>
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Mystic Path. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            {socialLinks.map((link, index) => (
              <a key={index} href={link.href} className="text-gray-400 hover:text-accent-gold transition-colors duration-300">
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
