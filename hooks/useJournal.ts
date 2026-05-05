import { useState, useCallback } from 'react';
import { getJournalEntries, addJournalEntry, type JournalEntry } from '@/lib/db';

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => getJournalEntries());

  const add = useCallback((entry: Omit<JournalEntry, 'created_at'>) => {
    addJournalEntry(entry);
    setEntries(getJournalEntries());
  }, []);

  const reload = useCallback(() => {
    setEntries(getJournalEntries());
  }, []);

  return { entries, add, reload };
}
