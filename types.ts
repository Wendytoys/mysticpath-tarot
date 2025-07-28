<<<<<<< HEAD

export interface TarotCardInfo {
  name: string;
  description: string;
  image: string; 
}

export interface TarotCardData extends TarotCardInfo {
  reversed: boolean;
}

export interface Reading {
  past: string;
  present: string;
  future: string;
  clarification?: string;
}

export interface SavedReading {
  reading: Reading;
  drawnCards: TarotCardData[];
  date: string; // YYYY-MM-DD
  walletAddress?: string | null;
  username?: string | null;
=======
import type { ReactNode } from 'react';

export interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface Testimonial {
  avatar: string;
  name: string;
  title: string;
  quote: string;
  rating: number;
}

export interface TarotCardData {
  id: number;
  name: string;
  image: string;
}

export interface TarotCardDetails {
  id: number;
  name: string;
  image: string;
  arcana: 'Major' | 'Minor';
  suit: 'Wands' | 'Cups' | 'Swords' | 'Pentacles' | null;
  keywords: string[];
  meaning_up: string;
  meaning_rev: string;
}

export interface KrishnaQuery {
  name: string;
  dob: string;
  time: string;
  place: string;
  question: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  selectedCards: TarotCardData[];
  initialReading: string;
  chatHistory: ChatMessage[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  publishedDate: string;
  keywords: string[];
  content: ReactNode;
>>>>>>> 8ef47c986f97a8432b6381df6e3decfcb8904424
}
