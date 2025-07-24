
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import JournalPage from './pages/JournalPage';
import JournalDetailPage from './pages/JournalDetailPage';
import CardLibraryPage from './pages/CardLibraryPage';
import CardDetailPage from './pages/CardDetailPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import Hyperspeed from './components/Hyperspeed';
import { hyperspeedPresets } from './components/Hyperspeed';


// In a real project, these would be imported from 'gsap'
declare const gsap: any;
declare const ScrollTrigger: any;

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="text-gray-200 font-lato overflow-x-hidden" style={{ background: '#000' }}>
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <Hyperspeed effectOptions={hyperspeedPresets.one} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/journal/:id" element={<JournalDetailPage />} />
              <Route path="/library" element={<CardLibraryPage />} />
              <Route path="/library/:cardName" element={<CardDetailPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
