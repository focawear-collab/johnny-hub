import { useState, useEffect, useCallback } from 'react';
import { getProfile, saveProfile, type Profile } from '@/lib/db';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile().then(p => { setProfile(p); setLoading(false); });
  }, []);

  const update = useCallback(async (changes: Partial<Profile>) => {
    await saveProfile(changes);
    setProfile(prev => prev ? { ...prev, ...changes } : prev);
  }, []);

  return { profile, loading, update };
}
