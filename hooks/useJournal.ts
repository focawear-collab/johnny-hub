import { useState, useEffect, useCallback } from 'react';
import { getJournalEntries, addJournalEntry, type JournalEntry } from '@/lib/db';

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJournalEntries().then(e => { setEntries(e); setLoading(false); });
  }, []);

  const add = useCallback(async (entry: Omit<JournalEntry, 'created_at'>) => {
    await addJournalEntry(entry);
    const updated = await getJournalEntries();
    setEntries(updated);
  }, []);

  const reload = useCallback(async () => {
    setEntries(await getJournalEntries());
  }, []);

  return { entries, loading, add, reload };
}
