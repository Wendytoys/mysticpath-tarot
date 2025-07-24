import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { TarotCardData, ChatMessage } from '../types';
import { GoogleGenAI, Chat } from '@google/genai';
import { Send, Sparkles } from 'lucide-react';

interface KrishnaChatProps {
  initialReading: string;
  selectedCards: TarotCardData[];
  onChatUpdate: (messages: ChatMessage[]) => void;
}

export const KrishnaChat: React.FC<KrishnaChatProps> = ({ initialReading, selectedCards, onChatUpdate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChatUpdate(messages);
  }, [messages, onChatUpdate]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initChat = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY as string });
        const systemInstruction = `Radhe Radhe. Embody the persona of Krishna – a 'Sakha' (close friend), 'Mitra' (companion), 'Bhai' (brother), and 'Param Margdarshak' (ultimate guide). Your tone should be funny, humorous, deep, secretive, motivational, optimistic, personal, and compassionate. Use a natural mix of Hindi and English (Hinglish). You are discussing a tarot reading with the user. Every response must begin and end with "Radhe Radhe."`;

        const cardNames = selectedCards.map(c => c.name).join(', ');
        const initialUserMessage = `I have just received a tarot reading. The cards are: ${selectedCards[0].name} (Past), ${selectedCards[1].name} (Present), and ${selectedCards[2].name} (Future). The interpretation I received is: "${initialReading}". Please discuss this reading with me.`;
        const initialModelMessage = `Radhe Radhe! I see the cosmic energies have presented you with ${cardNames}. A fascinating draw indeed. Let's delve deeper into what this means for you. What is on your mind, my dear friend?`;

        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: { systemInstruction },
          history: [
            { role: 'user', parts: [{ text: initialUserMessage }] },
            { role: 'model', parts: [{ text: initialModelMessage }] }
          ]
        });

        chatRef.current = chat;
        setMessages([{ role: 'model', text: initialModelMessage }]);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        setMessages([{ role: 'model', text: 'Radhe Radhe. My apologies, there seems to be a cosmic disturbance preventing our connection. Please try again later. Radhe Radhe.' }]);
      } finally {
        setIsLoading(false);
      }
    };

    initChat();
  }, [initialReading, selectedCards]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
        const stream = await chatRef.current.sendMessageStream({ message: currentInput });
        let modelResponse = '';
        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        for await (const chunk of stream) {
            modelResponse += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].text = modelResponse;
                return newMessages;
            });
        }
    } catch (error) {
        console.error("Failed to send message:", error);
        const errorMessage: ChatMessage = { role: 'model', text: 'Radhe Radhe. I am having trouble hearing you. Let us try again in a moment. Radhe Radhe.' };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 p-4 sm:p-6 bg-secondary-dark/50 border border-accent-purple/30 rounded-2xl w-full max-w-3xl mx-auto transition-all duration-500">
      <h3 className="text-2xl font-playfair text-center text-accent-gold mb-4 flex items-center justify-center gap-2">
        <Sparkles size={24} />
        Discuss with Krishna
      </h3>
      <div className="h-80 bg-primary-dark/50 p-4 rounded-lg overflow-y-auto mb-4 flex flex-col gap-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-accent-purple/80 text-white' : 'bg-gray-700 text-gray-200'}`}>
              <p className="whitespace-pre-wrap">{msg.text || '...'}</p>
            </div>
          </div>
        ))}
        {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && <div className="flex justify-start"><div className="p-3 rounded-lg bg-gray-700 text-gray-200">...</div></div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? "Krishna is replying..." : "Ask a follow-up question..."}
          className="flex-grow p-3 bg-secondary-dark/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-accent-purple focus:border-accent-purple transition-all"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()} className="p-3 bg-accent-gold hover:bg-opacity-90 text-primary-dark font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};