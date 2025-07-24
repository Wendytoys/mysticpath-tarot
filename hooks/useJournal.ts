import { useState, useEffect, useCallback } from 'react';
import type { JournalEntry, TarotCardData, ChatMessage } from '../types';

const JOURNAL_KEY = 'mystic_journal';

export const useJournal = (userId: string | null) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    if (userId) {
      try {
        const storedJournal = localStorage.getItem(JOURNAL_KEY);
        const allEntries: JournalEntry[] = storedJournal ? JSON.parse(storedJournal) : [];
        setEntries(allEntries.filter(entry => entry.userId === userId));
      } catch (error) {
        console.error("Failed to load journal from localStorage", error);
        setEntries([]);
      }
    } else {
      setEntries([]);
    }
  }, [userId]);

  const addJournalEntry = useCallback((entryData: { selectedCards: TarotCardData[]; initialReading: string; chatHistory: ChatMessage[] }) => {
    if (!userId) return;

    const newEntry: JournalEntry = {
      ...entryData,
      id: new Date().toISOString(),
      userId: userId,
      date: new Date().toISOString(),
    };

    try {
      const storedJournal = localStorage.getItem(JOURNAL_KEY);
      const allEntries: JournalEntry[] = storedJournal ? JSON.parse(storedJournal) : [];
      const updatedEntries = [...allEntries, newEntry];
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(updatedEntries));
      setEntries(prev => [...prev, newEntry]);
    } catch (error) {
      console.error("Failed to save journal entry", error);
    }
  }, [userId]);

  const getJournalEntryById = useCallback((id: string): JournalEntry | undefined => {
    try {
      const storedJournal = localStorage.getItem(JOURNAL_KEY);
      const allEntries: JournalEntry[] = storedJournal ? JSON.parse(storedJournal) : [];
      return allEntries.find(entry => entry.id === id && entry.userId === userId);
    } catch (error) {
      console.error("Failed to get journal entry by ID", error);
      return undefined;
    }
  }, [userId]);

  return { entries, addJournalEntry, getJournalEntryById };
};
