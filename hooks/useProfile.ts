import { useState, useCallback } from 'react';
import { getProfile, saveProfile, type Profile } from '@/lib/db';

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(() => getProfile());

  const update = useCallback((changes: Partial<Profile>) => {
    saveProfile(changes);
    setProfile(prev => ({ ...prev, ...changes }));
  }, []);

  return { profile, update };
}
