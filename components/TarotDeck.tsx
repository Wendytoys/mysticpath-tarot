import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { TarotCard } from './TarotCard';
import { KrishnaChat } from './KrishnaChat';
import type { TarotCardData, ChatMessage } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useJournal } from '../hooks/useJournal';
import { Wand2, Loader2, Sparkles, Save } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { allCards } from '../data/cardData';

// In a real project, these would be imported from 'gsap'
declare const gsap: any;

const majorArcana = allCards.filter(card => card.arcana === 'Major');

const shuffle = (array: TarotCardData[]) => [...array].sort(() => Math.random() - 0.5);

export const TarotDeck: React.FC = () => {
    const [phase, setPhase] = useState<'initial' | 'selecting' | 'revealed' | 'reading' | 'chatting' | 'cleanup'>('initial');
    const [drawnCards, setDrawnCards] = useState<TarotCardData[]>([]);
    const [selectedCards, setSelectedCards] = useState<TarotCardData[]>([]);
    const [reading, setReading] = useState('');
    const [isReadingLoading, setIsReadingLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    
    const { user } = useAuth();
    const { addJournalEntry } = useJournal(user?.id ?? null);

    const deck = useMemo(() => shuffle(majorArcana), []);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const tl = useRef<any>(null);

    const [dimensions, setDimensions] = useState({ width: 0, cardWidth: 100 });
    
    const generateTarotReading = useCallback(async () => {
        if (selectedCards.length !== 3) return;
        setIsReadingLoading(true);
        setReading('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `You are a mystical tarot reader. Provide a concise three-card reading for the following draw. For each card, briefly state its meaning in its position. Then, provide a short, synthesized summary of the overall narrative.
            - Past: ${selectedCards[0].name}
            - Present: ${selectedCards[1].name}
            - Future: ${selectedCards[2].name}`;
            
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setReading(result.text);
            setPhase('reading');
        } catch (error) {
            console.error("Error generating tarot reading:", error);
            setReading("Apologies, the cosmic energies are clouded at this moment. Please try again.");
            setPhase('reading');
        } finally {
            setIsReadingLoading(false);
        }
    }, [selectedCards]);

    useEffect(() => {
        if (phase === 'revealed' && selectedCards.length === 3 && !isReadingLoading) {
            generateTarotReading();
        }
    }, [phase, selectedCards, generateTarotReading, isReadingLoading]);

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            if (entries[0]) {
                const width = entries[0].contentRect.width;
                const cardWidth = Math.max(80, Math.min(120, width / 7));
                setDimensions({ width, cardWidth });
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
      cardRefs.current = cardRefs.current.slice(0, drawnCards.length);
    }, [drawnCards]);

    useEffect(() => {
        if (dimensions.width === 0) return;

        const ctx = gsap.context(() => {
            if (phase === 'selecting') {
                tl.current = gsap.timeline();
                const numCards = drawnCards.length;
                const arcWidth = dimensions.width * 0.9;
                const cardSpacing = Math.min(dimensions.cardWidth / 2 + 15, arcWidth / numCards);

                cardRefs.current.forEach((card, index) => {
                    if (!card) return;
                    tl.current.set(card, { x: 0, y: dimensions.cardWidth * 1.5, rotation: 0, opacity: 0, width: dimensions.cardWidth, height: dimensions.cardWidth * 1.67, scale: 1, zIndex: index }, 0);
                });

                tl.current.to(cardRefs.current, {
                    x: (i: number) => (i - (numCards - 1) / 2) * cardSpacing,
                    y: (i: number) => Math.abs(i - (numCards - 1) / 2) * (dimensions.cardWidth * 0.2),
                    rotation: (i: number) => (i - (numCards - 1) / 2) * 8,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    stagger: 0.1,
                });
            } else if (phase === 'revealed' || phase === 'reading' || phase === 'chatting') {
                const selectedElements = selectedCards.map(sc => cardRefs.current[drawnCards.findIndex(dc => dc.id === sc.id)]);
                const unselectedElements = cardRefs.current.filter(el => !selectedElements.includes(el));

                tl.current = gsap.timeline();
                const numSelected = selectedCards.length;
                const finalCardWidth = dimensions.cardWidth * 1.1;
                const finalSpreadWidth = Math.min(dimensions.width * 0.9, numSelected * (finalCardWidth + 20));
                const finalCardSpacing = numSelected > 1 ? finalSpreadWidth / (numSelected - 1) : 0;

                tl.current.to(unselectedElements, {
                    y: '+=50',
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power2.in',
                }).to(selectedElements, {
                    x: (i: number) => (i - (numSelected - 1) / 2) * finalCardSpacing,
                    y: 10,
                    rotation: 0,
                    scale: 1.1,
                    zIndex: 100,
                    duration: 0.7,
                    ease: 'power3.inOut',
                    stagger: 0.1,
                }, "-=0.2").fromTo('.reveal-label', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.2, duration: 0.5 }, ">-0.3");
            } else if (phase === 'cleanup') {
                tl.current = gsap.timeline({
                    onComplete: () => {
                        setDrawnCards([]);
                        setSelectedCards([]);
                        setReading('');
                        setChatHistory([]);
                        setPhase('initial');
                    }
                });
                tl.current
                    .to('.reading-container, .chat-container, .reset-button', { opacity: 0, duration: 0.3 }, 0)
                    .to('.reveal-label', { opacity: 0, duration: 0.3 }, 0)
                    .to(cardRefs.current, { y: 200, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0);
            }
        }, containerRef);
        return () => ctx.revert();
    }, [phase, drawnCards, selectedCards, deck, dimensions]);

    const handleDraw = () => {
        setDrawnCards(deck.slice(0, 7));
        setPhase('selecting');
    };

    const handleSelectCard = (card: TarotCardData) => {
        if (phase !== 'selecting' || selectedCards.length >= 3 || selectedCards.find(c => c.id === card.id)) {
            return;
        }
        const newSelected = [...selectedCards, card];
        setSelectedCards(newSelected);
        if (newSelected.length === 3) {
            setTimeout(() => setPhase('revealed'), 300);
        }
    };
    
    const handleReset = (save: boolean = false) => {
        if (save && user && phase === 'chatting' && selectedCards.length === 3 && reading && chatHistory.length > 1) {
             addJournalEntry({
                selectedCards,
                initialReading: reading,
                chatHistory: chatHistory
            });
        }
        setPhase('cleanup');
    }

    const handleMouseEnter = useCallback((cardEl: HTMLDivElement | null) => {
      if (cardEl && phase === 'selecting' && !cardEl.classList.contains('is-selected')) {
        gsap.to(cardEl, { yPercent: -15, scale: 1.05, duration: 0.3, ease: 'power2.out' });
      }
    }, [phase]);

    const handleMouseLeave = useCallback((cardEl: HTMLDivElement | null) => {
      if (cardEl && phase === 'selecting' && !cardEl.classList.contains('is-selected')) {
        gsap.to(cardEl, { yPercent: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
      }
    }, [phase]);

    const isSelected = (card: TarotCardData) => selectedCards.some(c => c.id === card.id);
    
    const renderPrompt = () => {
        if (phase === 'selecting') {
            const remaining = 3 - selectedCards.length;
            if (remaining > 0) return `Choose ${remaining} more card${remaining > 1 ? 's' : ''}...`;
            return 'A moment of reflection...';
        }
        if (phase === 'revealed' || phase === 'reading' || phase === 'chatting') {
            return 'Your past, present, and future.';
        }
        return '';
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 min-h-[400px] md:min-h-[450px] w-full" ref={containerRef}>
            {phase === 'initial' && (
                <div className="text-center">
                    <button onClick={handleDraw} className="bg-accent-gold hover:bg-opacity-90 text-primary-dark font-bold py-3 px-8 md:py-4 md:px-10 rounded-full transition-all duration-300 transform hover:scale-105 text-base md:text-lg shadow-lg shadow-accent-gold/30 flex items-center gap-2 mx-auto">
                        <Wand2 size={24} />
                        Draw Your Cards
                    </button>
                    <p className="mt-4 text-gray-400 text-sm md:text-base">Click to draw 7 cards from the deck.</p>
                </div>
            )}

            {(phase === 'selecting' || phase === 'revealed' || phase === 'reading' || phase === 'chatting') && (
                 <div className="w-full mb-6 md:mb-8 text-center h-12 flex items-center justify-center">
                    <p className="text-lg md:text-xl font-playfair text-white transition-opacity duration-300">
                        {renderPrompt()}
                    </p>
                 </div>
            )}
            
            <div className="relative w-full flex justify-center items-start" style={{ height: dimensions.cardWidth * 1.67 + 60 }}>
              {drawnCards.map((card, index) => (
                  <TarotCard
                      ref={el => { cardRefs.current[index] = el; }}
                      key={card.id}
                      image={card.image}
                      isFlipped={(phase === 'revealed' || phase === 'reading' || phase === 'chatting') && isSelected(card)}
                      isSelectable={phase === 'selecting' && selectedCards.length < 3}
                      isSelected={isSelected(card)}
                      onClick={() => handleSelectCard(card)}
                      onMouseEnter={() => handleMouseEnter(cardRefs.current[index])}
                      onMouseLeave={() => handleMouseLeave(cardRefs.current[index])}
                  />
              ))}
            </div>

             {(phase === 'revealed' || phase === 'reading' || phase === 'chatting') && (
                <div className="mt-8 md:mt-12 text-center w-full">
                     <div className="flex justify-center gap-4 md:gap-8 mb-4 w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto relative -top-4">
                        {selectedCards.map((card, index) => (
                           <div key={card.id} className="text-white font-playfair flex-1 reveal-label opacity-0" style={{ minWidth: 0 }}>
                               <p className="font-bold text-base md:text-lg">{['Past', 'Present', 'Future'][index]}</p>
                               <p className="text-xs md:text-sm text-gray-300 truncate">{card.name}</p>
                           </div>
                        ))}
                    </div>

                    { isReadingLoading && (
                        <div className="flex justify-center items-center gap-2 mt-6 text-accent-gold">
                            <Loader2 className="animate-spin" size={24} />
                            <p className="font-playfair text-lg">Interpreting the cards...</p>
                        </div>
                    )}

                    { phase === 'reading' && reading && !isReadingLoading && (
                        <div className="reading-container mt-6 w-full max-w-2xl mx-auto text-left bg-primary-dark/30 p-6 rounded-lg">
                            <p className="text-gray-300 whitespace-pre-wrap">{reading}</p>
                            <div className="flex justify-center gap-4 mt-6">
                                <button onClick={() => setPhase('chatting')} className="bg-accent-purple hover:bg-opacity-90 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                                    <Sparkles size={20} />
                                    Discuss with Krishna
                                </button>
                                <button onClick={() => handleReset(false)} className="reset-button bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    { phase === 'chatting' && (
                        <div className="chat-container">
                          <KrishnaChat 
                            initialReading={reading} 
                            selectedCards={selectedCards} 
                            onChatUpdate={setChatHistory}
                           />
                           <button onClick={() => handleReset(true)} className="reset-button mt-6 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                               {user ? <Save size={20} /> : null}
                               {user ? 'Save & Start New' : 'Start a New Reading'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};