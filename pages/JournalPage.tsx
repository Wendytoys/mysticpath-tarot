import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useJournal } from '../hooks/useJournal';
import { BookMarked, ChevronRight } from 'lucide-react';

const JournalPage: React.FC = () => {
  const { user, loading } = useAuth();
  const { entries } = useJournal(user?.id ?? null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    return <div className="pt-32 pb-20 min-h-screen"></div>;
  }

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">Leela Patrika</h1>
          <p className="text-lg text-gray-400">
            Your sacred journal of cosmic conversations and tarot insights.
          </p>
        </div>

        {entries.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
              <Link to={`/journal/${entry.id}`} key={entry.id} className="block bg-secondary-dark/50 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:border-accent-purple hover:shadow-lg hover:shadow-accent-purple/20 transform hover:-translate-y-1">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">{new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <h2 className="text-xl font-bold text-white font-playfair">Past, Present, Future Reading</h2>
                    <div className="flex items-center gap-2 sm:gap-4 mt-3">
                      {entry.selectedCards.map((card, idx) => (
                        <div key={card.id} className="text-center">
                            <p className="text-xs font-bold mb-1 text-gray-300">{['Past', 'Present', 'Future'][idx]}</p>
                           <img src={card.image} alt={card.name} className="w-10 h-16 sm:w-12 sm:h-20 object-cover rounded-sm border border-gray-600"/>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="w-8 h-8 text-accent-gold flex-shrink-0 ml-4" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center max-w-xl mx-auto mt-16 text-gray-400">
            <BookMarked size={64} className="mx-auto text-accent-purple/50 mb-4" />
            <h3 className="text-2xl font-playfair text-white">Your Journal is Empty</h3>
            <p className="mt-2">Your saved readings and conversations with Krishna will appear here. Begin a new reading to start your journey.</p>
            <button onClick={() => navigate('/')} className="mt-6 bg-accent-gold hover:bg-opacity-90 text-primary-dark font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
              Start a New Reading
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
