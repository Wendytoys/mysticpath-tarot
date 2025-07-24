import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useJournal } from '../hooks/useJournal';
import type { JournalEntry } from '../types';
import { ArrowLeft, Sparkles } from 'lucide-react';

const JournalDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const { getJournalEntryById } = useJournal(user?.id ?? null);
    const navigate = useNavigate();
    const [entry, setEntry] = useState<JournalEntry | null | undefined>(undefined);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        if (id) {
            setEntry(getJournalEntryById(id));
        }
    }, [id, user, getJournalEntryById, navigate]);

    if (entry === undefined) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex items-center justify-center text-white font-playfair text-2xl">
                Loading your memory...
            </div>
        );
    }

    if (entry === null || !entry) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center text-center text-white">
                <h1 className="text-4xl font-playfair mb-4">Memory not found</h1>
                <p className="text-gray-400">This entry in your journal could not be found.</p>
                <Link to="/journal" className="mt-6 flex items-center gap-2 text-accent-gold hover:underline">
                    <ArrowLeft size={18} /> Back to Leela Patrika
                </Link>
            </div>
        );
    }
    
    return (
        <div className="pt-32 pb-20 min-h-screen">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <Link to="/journal" className="flex items-center gap-2 text-accent-gold hover:underline mb-8">
                        <ArrowLeft size={20} />
                        Back to Leela Patrika
                    </Link>

                    <p className="text-gray-400 mb-2">{new Date(entry.date).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-8">Your Cosmic Insight</h1>

                    {/* Cards Display */}
                    <div className="mb-12">
                         <div className="flex justify-center gap-4 md:gap-8 mb-4">
                            {entry.selectedCards.map((card, index) => (
                               <div key={card.id} className="text-white font-playfair flex-1 text-center" style={{ minWidth: 0 }}>
                                   <p className="font-bold text-lg md:text-xl">{['Past', 'Present', 'Future'][index]}</p>
                                   <p className="text-sm md:text-base text-gray-300 truncate">{card.name}</p>
                                   <img src={card.image} alt={card.name} className="w-full max-w-[150px] aspect-[3/5] object-cover rounded-lg border-2 border-accent-purple/50 mt-2 mx-auto"/>
                               </div>
                            ))}
                        </div>
                    </div>

                    {/* Initial Reading */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-playfair text-white mb-4">The Initial Interpretation</h2>
                        <div className="bg-primary-dark/30 p-6 rounded-lg">
                            <p className="text-gray-300 whitespace-pre-wrap">{entry.initialReading}</p>
                        </div>
                    </div>

                    {/* Krishna Chat */}
                    <div>
                        <h2 className="text-3xl font-playfair text-center text-accent-gold mb-4 flex items-center justify-center gap-2">
                            <Sparkles size={28} />
                            Your Conversation with Krishna
                        </h2>
                        <div className="p-4 sm:p-6 bg-secondary-dark/50 border border-accent-purple/30 rounded-2xl w-full">
                             <div className="h-[500px] bg-primary-dark/50 p-4 rounded-lg overflow-y-auto flex flex-col gap-4">
                                {entry.chatHistory.map((msg, index) => (
                                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-accent-purple/80 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                      <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                  </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JournalDetailPage;
