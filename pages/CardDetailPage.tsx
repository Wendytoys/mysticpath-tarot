import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { allCards } from '../data/cardData';
import { ArrowLeft, Sun, Moon } from 'lucide-react';

const slugify = (text: string) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

const CardDetailPage: React.FC = () => {
    const { cardName } = useParams<{ cardName: string }>();
    const card = allCards.find(c => slugify(c.name) === cardName);

    if (!card) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center text-center text-white">
                <h1 className="text-4xl font-playfair mb-4">Card not found</h1>
                <p className="text-gray-400">The card you are looking for does not exist in the Gyan Kosh.</p>
                <Link to="/library" className="mt-6 flex items-center gap-2 text-accent-gold hover:underline">
                    <ArrowLeft size={18} /> Back to Card Library
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 min-h-screen">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto">
                    <Link to="/library" className="flex items-center gap-2 text-accent-gold hover:underline mb-8">
                        <ArrowLeft size={20} />
                        Back to Card Library
                    </Link>

                    <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
                        <div className="md:col-span-2">
                             <img src={card.image} alt={card.name} className="w-full max-w-sm mx-auto aspect-[3/5] object-cover rounded-xl border-4 border-accent-purple/50 shadow-2xl shadow-accent-purple/20"/>
                        </div>
                        <div className="md:col-span-3">
                            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-2">{card.name}</h1>
                            <p className="text-lg text-gray-400 mb-4">{card.arcana} Arcana {card.suit ? `• ${card.suit}` : ''}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-8">
                                {card.keywords.map(keyword => (
                                    <span key={keyword} className="bg-secondary-dark text-accent-gold text-xs font-semibold px-3 py-1 rounded-full">
                                        {keyword}
                                    </span>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-playfair text-white mb-3 flex items-center gap-2">
                                        <Sun className="text-accent-gold" size={24} />
                                        Upright Meaning
                                    </h2>
                                    <p className="text-gray-300 leading-relaxed">{card.meaning_up}</p>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-playfair text-white mb-3 flex items-center gap-2">
                                        <Moon className="text-accent-purple" size={24} />
                                        Reversed Meaning
                                    </h2>
                                    <p className="text-gray-300 leading-relaxed">{card.meaning_rev}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardDetailPage;
