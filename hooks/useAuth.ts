// FILE: app/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

interface UseAuthReturn extends AuthState {
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signInWithApple: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// useAuth
// ---------------------------------------------------------------------------
export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  // ── Subscribe to auth state changes ──────────────────────────────────────
  useEffect(() => {
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    // Listen for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState({
          user: session?.user ?? null,
          session,
          loading: false,
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ── signInWithEmail ───────────────────────────────────────────────────────
  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<{ error: Error | null }> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ? new Error(error.message) : null };
    },
    []
  );

  // ── signUpWithEmail ───────────────────────────────────────────────────────
  const signUpWithEmail = useCallback(
    async (
      email: string,
      password: string,
      fullName?: string
    ): Promise<{ error: Error | null }> => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName ?? '',
          },
        },
      });
      return { error: error ? new Error(error.message) : null };
    },
    []
  );

  // ── signInWithApple ───────────────────────────────────────────────────────
  const signInWithApple = useCallback(async (): Promise<{ error: Error | null }> => {
    if (Platform.OS !== 'ios') {
      return { error: new Error('Apple Sign-In is only available on iOS.') };
    }

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // identityToken is required to sign in with Supabase
      if (!credential.identityToken) {
        return { error: new Error('Apple Sign-In did not return an identity token.') };
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
        nonce: credential.authorizationCode ?? undefined,
      });

      if (error) return { error: new Error(error.message) };

      // Update display name on first sign-in (Apple only sends it once)
      if (credential.fullName) {
        const fullName = [
          credential.fullName.givenName,
          credential.fullName.familyName,
        ]
          .filter(Boolean)
          .join(' ');

        if (fullName) {
          await supabase.auth.updateUser({ data: { full_name: fullName } });
        }
      }

      return { error: null };
    } catch (err: unknown) {
      // ERR_CANCELED = user dismissed the sheet — not an error we surface
      if (
        err instanceof Error &&
        (err as Error & { code?: string }).code === 'ERR_CANCELED'
      ) {
        return { error: null };
      }
      return { error: err instanceof Error ? err : new Error('Unknown Apple Sign-In error.') };
    }
  }, []);

  // ── signOut ───────────────────────────────────────────────────────────────
  const signOut = useCallback(async (): Promise<void> => {
    await supabase.auth.signOut();
  }, []);

  return {
    ...state,
    signInWithEmail,
    signUpWithEmail,
    signInWithApple,
    signOut,
  };
}
