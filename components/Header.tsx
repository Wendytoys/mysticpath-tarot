import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../hooks/useAuth';
import { Wallet, LogOut, BookMarked, Menu, X, Library, Newspaper } from 'lucide-react';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, login, logout, isConnected } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginClick = () => {
    console.log('Header: Connect Wallet button clicked.');
    login();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const pageLinks = [
      { name: 'Card Library', href: '/library' },
      { name: 'Blog', href: '/blog' },
  ];

  const anchorLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  const handleAnchorClick = (selector: string) => {
    if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
            document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
    } else {
        document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };
  
  const handleLogoClick = () => {
     handleAnchorClick('#hero');
  }

  const MobileNavLinks = () => (
    <>
      {anchorLinks.map((link) => (
        <button
          key={link.name}
          onClick={() => handleAnchorClick(link.href)}
          className="text-2xl text-gray-300 hover:text-accent-gold transition-colors duration-300 font-medium py-3"
        >
          {link.name}
        </button>
      ))}
      <Link
        to="/library"
        onClick={() => setIsMenuOpen(false)}
        className="text-2xl text-gray-300 hover:text-accent-gold transition-colors duration-300 font-medium py-3 flex items-center gap-3"
      >
        <Library size={24} />
        Card Library
      </Link>
       <Link
        to="/blog"
        onClick={() => setIsMenuOpen(false)}
        className="text-2xl text-gray-300 hover:text-accent-gold transition-colors duration-300 font-medium py-3 flex items-center gap-3"
      >
        <Newspaper size={24} />
        Blog
      </Link>
       <hr className="border-gray-700 w-1/2 my-4" />
       {isConnected && user ? (
         <>
          <Link
            to="/journal"
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl text-gray-300 hover:text-accent-gold transition-colors duration-300 font-medium py-3 flex items-center gap-3"
          >
            <BookMarked size={24} />
            My Journal
          </Link>
          <button
            onClick={() => { logout(); setIsMenuOpen(false); }}
            className="text-2xl text-gray-300 hover:text-accent-gold transition-colors duration-300 font-medium py-3 flex items-center gap-3"
          >
            <LogOut size={24} />
            Logout
          </button>
         </>
       ) : (
          <button 
            onClick={() => { handleLoginClick(); setIsMenuOpen(false); }}
            className="flex items-center gap-3 bg-accent-purple hover:bg-opacity-80 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 mt-4 text-xl"
          >
            <Wallet className="w-6 h-6" />
            Connect Wallet
          </button>
       )}
    </>
  );

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'bg-primary-dark/80 backdrop-blur-lg shadow-lg shadow-accent-purple/10' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
            <Logo className="h-8 w-8 text-accent-gold" />
            <span className="text-xl font-playfair font-bold text-white">Mystic Path</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {anchorLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleAnchorClick(link.href)}
                className="text-gray-300 hover:text-accent-gold transition-colors duration-300 font-medium"
              >
                {link.name}
              </button>
            ))}
            {pageLinks.map((link) => (
                <Link
                    key={link.name}
                    to={link.href}
                    className="text-gray-300 hover:text-accent-gold transition-colors duration-300 font-medium"
                >
                    {link.name}
                </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center">
            {isConnected ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2">
                  {/* Placeholder until we have user data */}
                  <div className="w-9 h-9 rounded-full bg-accent-purple flex items-center justify-center text-white font-bold">
                    {user?.profile?.name ? user.profile.name.charAt(0) : 'W'}
                  </div>
                  <span className="text-white font-medium">{user?.profile?.name || 'Connected'}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-secondary-dark rounded-md shadow-lg py-1 border border-gray-700/50">
                     <Link
                      to="/journal"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-accent-purple/30 flex items-center gap-2"
                    >
                      <BookMarked size={16} />
                      My Journal
                    </Link>
                    <button
                      onClick={() => { logout(); setIsDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-accent-purple/30 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={handleLoginClick}
                className="flex items-center gap-2 bg-accent-purple hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)} className="text-white">
              <Menu size={28} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-primary-dark z-[100] flex flex-col items-center justify-center transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-white">
              <X size={32} />
          </button>
          <div className="flex flex-col items-center text-center space-y-2">
            <MobileNavLinks />
          </div>
      </div>
    </>
  );
};

export default Header;
