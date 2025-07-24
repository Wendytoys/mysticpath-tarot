import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { allCards } from '../data/cardData';
import type { TarotCardDetails } from '../types';
import { Search, Wand2, GlassWater, Sword, Gem } from 'lucide-react';

const suits = ['Wands', 'Cups', 'Swords', 'Pentacles'];

const slugify = (text: string) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

const CardLibraryPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'All' | 'Major' | 'Minor'>('All');
    const [suitFilter, setSuitFilter] = useState<string | null>(null);

    const filteredCards = useMemo(() => {
        return allCards
            .filter(card => {
                if (filter === 'Major') return card.arcana === 'Major';
                if (filter === 'Minor') return card.arcana === 'Minor';
                return true;
            })
            .filter(card => {
                if (filter === 'Minor' && suitFilter) {
                    return card.suit === suitFilter;
                }
                return true;
            })
            .filter(card => 
                card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                card.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
            );
    }, [searchTerm, filter, suitFilter]);

    const handleFilterChange = (newFilter: 'All' | 'Major' | 'Minor') => {
        setFilter(newFilter);
        if (newFilter !== 'Minor') {
            setSuitFilter(null);
        }
    }
    
    const SuitIcon = ({suit}: {suit: string | null}) => {
        switch(suit){
            case 'Wands': return <Wand2 className="w-5 h-5" />;
            case 'Cups': return <GlassWater className="w-5 h-5" />;
            case 'Swords': return <Sword className="w-5 h-5" />;
            case 'Pentacles': return <Gem className="w-5 h-5" />;
            default: return null;
        }
    }

    return (
        <div className="pt-32 pb-20 min-h-screen">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">Gyan Kosh</h1>
                    <p className="text-lg text-gray-400">
                        Explore the wisdom of the 78 Tarot cards. Search, filter, and discover their meanings.
                    </p>
                </div>

                {/* Search and Filter Controls */}
                <div className="max-w-4xl mx-auto mb-12 sticky top-20 z-20 bg-primary-dark/80 backdrop-blur-lg p-4 rounded-xl border border-gray-700/50">
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or keyword (e.g., 'strength', 'beginnings')..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 pl-12 bg-secondary-dark/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-accent-purple focus:border-accent-purple transition-all"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button onClick={() => handleFilterChange('All')} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filter === 'All' ? 'bg-accent-gold text-primary-dark' : 'bg-secondary-dark text-gray-300 hover:bg-gray-700'}`}>All</button>
                        <button onClick={() => handleFilterChange('Major')} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filter === 'Major' ? 'bg-accent-gold text-primary-dark' : 'bg-gray-700'}`}>Major Arcana</button>
                        <button onClick={() => handleFilterChange('Minor')} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filter === 'Minor' ? 'bg-accent-gold text-primary-dark' : 'bg-gray-700'}`}>Minor Arcana</button>
                    </div>
                    {filter === 'Minor' && (
                        <div className="flex flex-wrap gap-2 justify-center mt-3 pt-3 border-t border-gray-700/50">
                             <button onClick={() => setSuitFilter(null)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${!suitFilter ? 'bg-accent-purple text-white' : 'bg-secondary-dark text-gray-300 hover:bg-gray-700'}`}>All Suits</button>
                            {suits.map(suit => (
                                <button key={suit} onClick={() => setSuitFilter(suit)} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${suitFilter === suit ? 'bg-accent-purple text-white' : 'bg-secondary-dark text-gray-300 hover:bg-gray-700'}`}>
                                    <SuitIcon suit={suit} />
                                    {suit}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Card Grid */}
                {filteredCards.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                        {filteredCards.map(card => (
                            <Link to={`/library/${slugify(card.name)}`} key={card.id} className="group card-container block">
                                <div className="card-inner w-full aspect-[3/5] relative transition-transform duration-300 group-hover:transform group-hover:-translate-y-2">
                                    <img src={card.image} alt={card.name} className="w-full h-full object-cover rounded-lg border-2 border-gray-700 group-hover:border-accent-gold transition-colors duration-300" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg"></div>
                                    <p className="absolute bottom-2 left-0 right-0 text-center text-white font-playfair font-bold text-sm sm:text-base px-1">{card.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-400 mt-16">
                        <p className="text-xl">No cards found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardLibraryPage;