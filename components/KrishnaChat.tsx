import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { TarotCardData, ChatMessage } from '../types';
import { GoogleGenAI, Chat } from '@google/genai';
import { Send, Sparkles, ShieldCheck } from 'lucide-react';
import { MiniKit, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js';
import { useAuth } from '../hooks/useAuth'; // To get the user's wallet address as a signal

interface KrishnaChatProps {
  initialReading: string;
  selectedCards: TarotCardData[];
  onChatUpdate: (messages: ChatMessage[]) => void;
}

export const KrishnaChat: React.FC<KrishnaChatProps> = ({ initialReading, selectedCards, onChatUpdate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // State to track verification
  const [verificationStatus, setVerificationStatus] = useState(''); // State for user feedback
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Effect to update parent component with chat messages
  useEffect(() => {
    onChatUpdate(messages);
  }, [messages, onChatUpdate]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Chat initialization logic, now separated
  const initChat = useCallback(async () => {
    setIsLoading(true);
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
  }, [initialReading, selectedCards]);

  // This effect triggers chat initialization only after verification
  useEffect(() => {
    if (isVerified) {
      initChat();
    }
  }, [isVerified, initChat]);

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

  // World ID Verification Logic
  const handleVerify = async () => {
    if (!MiniKit.isInstalled()) {
      setVerificationStatus('Error: Please use World App to verify.');
      return;
    }
    
    setVerificationStatus('Opening World App for verification...');
    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: 'krishna-ji-chat',
        signal: user?.walletAddress, // Optional: link proof to the user's wallet
        verification_level: VerificationLevel.Orb,
      });

      if (finalPayload.status === 'success') {
        setVerificationStatus('Verifying proof with our servers...');
        const response = await fetch('/api/verify-proof', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payload: finalPayload,
            action: 'krishna-ji-chat',
            signal: user?.walletAddress,
          }),
        });

        const result = await response.json();
        if (response.ok && result.success) {
          setVerificationStatus('Verification successful! Starting chat...');
          setIsVerified(true);
        } else {
          throw new Error(result.detail || 'Proof could not be verified.');
        }
      } else {
        throw new Error(finalPayload.error_code || 'Verification was not successful.');
      }
    } catch (error) {
      console.error('Verification process failed:', error);
      setVerificationStatus(`Verification failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Render verification gate if not verified
  if (!isVerified) {
    return (
      <div className="mt-8 p-6 bg-secondary-dark/50 border border-accent-purple/30 rounded-2xl w-full max-w-3xl mx-auto text-center">
        <h3 className="text-2xl font-playfair text-accent-gold mb-4">Chat with Krishna</h3>
        <p className="text-gray-300 mb-6">To ensure a genuine conversation with Krishna, please verify you are a unique human with World ID.</p>
        <button
          onClick={handleVerify}
          disabled={!!verificationStatus && verificationStatus !== 'Verification successful! Starting chat...'}
          className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
        >
          <ShieldCheck size={24} />
          Verify with World ID
        </button>
        {verificationStatus && <p className="text-sm text-gray-400 mt-4">{verificationStatus}</p>}
      </div>
    );
  }

  // Render chat interface if verified
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
