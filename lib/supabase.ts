// FILE: app/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------------------------------------------------------------------------
// Database type definitions
// ---------------------------------------------------------------------------
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          level: 'Principiante' | 'Amateur' | 'Avanzado' | 'Maestro';
          oven_type: string | null;
          mixer_type: string | null;
          scale_brand: string | null;
          preferred_style: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          level?: 'Principiante' | 'Amateur' | 'Avanzado' | 'Maestro';
          oven_type?: string | null;
          mixer_type?: string | null;
          scale_brand?: string | null;
          preferred_style?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          level?: 'Principiante' | 'Amateur' | 'Avanzado' | 'Maestro';
          oven_type?: string | null;
          mixer_type?: string | null;
          scale_brand?: string | null;
          preferred_style?: string | null;
          updated_at?: string;
        };
      };
      pizza_styles: {
        Row: {
          id: string;
          name: string;
          region: string | null;
          hyd_default: number | null;
          ball_default: number | null;
          salt_default: number | null;
          oil_default: number | null;
          ferment_default: number | null;
          temp_default: number | null;
        };
        Insert: {
          id: string;
          name: string;
          region?: string | null;
          hyd_default?: number | null;
          ball_default?: number | null;
          salt_default?: number | null;
          oil_default?: number | null;
          ferment_default?: number | null;
          temp_default?: number | null;
        };
        Update: {
          id?: string;
          name?: string;
          region?: string | null;
          hyd_default?: number | null;
          ball_default?: number | null;
          salt_default?: number | null;
          oil_default?: number | null;
          ferment_default?: number | null;
          temp_default?: number | null;
        };
      };
      recipes: {
        Row: {
          id: string;
          name: string;
          style_id: string | null;
          level: string | null;
          tag: string | null;
          time_minutes: number | null;
          description: string | null;
          instructions: Json;
          ingredients: Json;
          tips: Json;
          stars_avg: number;
          is_public: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          style_id?: string | null;
          level?: string | null;
          tag?: string | null;
          time_minutes?: number | null;
          description?: string | null;
          instructions?: Json;
          ingredients?: Json;
          tips?: Json;
          stars_avg?: number;
          is_public?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          style_id?: string | null;
          level?: string | null;
          tag?: string | null;
          time_minutes?: number | null;
          description?: string | null;
          instructions?: Json;
          ingredients?: Json;
          tips?: Json;
          stars_avg?: number;
          is_public?: boolean;
          created_by?: string | null;
        };
      };
      bake_sessions: {
        Row: {
          id: string;
          user_id: string;
          style_id: string | null;
          recipe_id: string | null;
          pizzas: number;
          ball_size_g: number;
          hyd_pct: number;
          salt_pct: number;
          oil_pct: number;
          ferment_hours: number;
          ferment_temp_c: number;
          flour_g: number | null;
          water_g: number | null;
          salt_g: number | null;
          oil_g: number | null;
          yeast_g: number | null;
          started_at: string | null;
          ready_at: string | null;
          completed_at: string | null;
          status: 'planned' | 'mixing' | 'bulk' | 'cold' | 'bench' | 'proofing' | 'baking' | 'done';
          rating: number | null;
          notes: string | null;
          photo_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          style_id?: string | null;
          recipe_id?: string | null;
          pizzas: number;
          ball_size_g: number;
          hyd_pct: number;
          salt_pct: number;
          oil_pct: number;
          ferment_hours: number;
          ferment_temp_c: number;
          flour_g?: number | null;
          water_g?: number | null;
          salt_g?: number | null;
          oil_g?: number | null;
          yeast_g?: number | null;
          started_at?: string | null;
          ready_at?: string | null;
          completed_at?: string | null;
          status?: 'planned' | 'mixing' | 'bulk' | 'cold' | 'bench' | 'proofing' | 'baking' | 'done';
          rating?: number | null;
          notes?: string | null;
          photo_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          style_id?: string | null;
          recipe_id?: string | null;
          pizzas?: number;
          ball_size_g?: number;
          hyd_pct?: number;
          salt_pct?: number;
          oil_pct?: number;
          ferment_hours?: number;
          ferment_temp_c?: number;
          flour_g?: number | null;
          water_g?: number | null;
          salt_g?: number | null;
          oil_g?: number | null;
          yeast_g?: number | null;
          started_at?: string | null;
          ready_at?: string | null;
          completed_at?: string | null;
          status?: 'planned' | 'mixing' | 'bulk' | 'cold' | 'bench' | 'proofing' | 'baking' | 'done';
          rating?: number | null;
          notes?: string | null;
          photo_url?: string | null;
        };
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          bake_session_id: string | null;
          title: string;
          style_id: string | null;
          date: string;
          rating: number | null;
          notes: string | null;
          photo_url: string | null;
          tags: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bake_session_id?: string | null;
          title: string;
          style_id?: string | null;
          date: string;
          rating?: number | null;
          notes?: string | null;
          photo_url?: string | null;
          tags?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bake_session_id?: string | null;
          title?: string;
          style_id?: string | null;
          date?: string;
          rating?: number | null;
          notes?: string | null;
          photo_url?: string | null;
          tags?: string[];
        };
      };
      saved_recipes: {
        Row: {
          user_id: string;
          recipe_id: string;
          saved_at: string;
        };
        Insert: {
          user_id: string;
          recipe_id: string;
          saved_at?: string;
        };
        Update: {
          user_id?: string;
          recipe_id?: string;
          saved_at?: string;
        };
      };
      shopping_lists: {
        Row: {
          id: string;
          user_id: string;
          bake_session_id: string | null;
          items: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bake_session_id?: string | null;
          items?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bake_session_id?: string | null;
          items?: Json;
        };
      };
      week_plans: {
        Row: {
          id: string;
          user_id: string;
          week_start: string;
          days: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_start: string;
          days?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_start?: string;
          days?: Json;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// ---------------------------------------------------------------------------
// Helper types
// ---------------------------------------------------------------------------
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type PizzaStyle = Database['public']['Tables']['pizza_styles']['Row'];
export type Recipe = Database['public']['Tables']['recipes']['Row'];
export type BakeSession = Database['public']['Tables']['bake_sessions']['Row'];
export type JournalEntry = Database['public']['Tables']['journal_entries']['Row'];
export type SavedRecipe = Database['public']['Tables']['saved_recipes']['Row'];
export type ShoppingList = Database['public']['Tables']['shopping_lists']['Row'];
export type WeekPlan = Database['public']['Tables']['week_plans']['Row'];

export type BakeStatus = BakeSession['status'];
export type UserLevel = Profile['level'];

// ---------------------------------------------------------------------------
// Supabase client
// ---------------------------------------------------------------------------
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set in your .env file.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
