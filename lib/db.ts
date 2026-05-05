// Database client — Neon Postgres (serverless, HTTP transport)
// Connection string from env: EXPO_PUBLIC_NEON_URL
// Uses @neondatabase/serverless which works in React Native via fetch polyfill

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.EXPO_PUBLIC_NEON_URL!);

// ── Init (run once on app start) ──────────────────────────────────────────
export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS profile (
      id         TEXT PRIMARY KEY DEFAULT 'me',
      username   TEXT,
      level      TEXT DEFAULT 'Principiante',
      oven_type  TEXT,
      mixer_type TEXT,
      pref_style TEXT,
      language   TEXT DEFAULT 'es',
      notifs     BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS bake_sessions (
      id           TEXT PRIMARY KEY,
      style_id     TEXT,
      pizzas       INT,
      ball_size_g  INT,
      hyd_pct      NUMERIC(4,1),
      salt_pct     NUMERIC(4,2),
      oil_pct      NUMERIC(4,2),
      ferment_h    INT,
      ferment_temp INT,
      flour_g      INT,
      water_g      INT,
      salt_g       NUMERIC(6,2),
      oil_g        NUMERIC(6,2),
      yeast_g      NUMERIC(6,3),
      started_at   TIMESTAMPTZ,
      ready_at     TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      status       TEXT DEFAULT 'planned',
      created_at   TIMESTAMPTZ DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id         TEXT PRIMARY KEY,
      session_id TEXT REFERENCES bake_sessions(id),
      title      TEXT NOT NULL,
      style_id   TEXT,
      date       DATE NOT NULL,
      rating     NUMERIC(3,2),
      notes      TEXT,
      photo_url  TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS shopping_items (
      id       TEXT PRIMARY KEY,
      list_id  TEXT,
      name     TEXT,
      qty      TEXT,
      unit     TEXT,
      category TEXT,
      checked  BOOLEAN DEFAULT false
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS saved_recipes (
      recipe_id TEXT PRIMARY KEY,
      saved_at  TIMESTAMPTZ DEFAULT now()
    )
  `;
  await sql`INSERT INTO profile (id) VALUES ('me') ON CONFLICT DO NOTHING`;
}

// ── Types ─────────────────────────────────────────────────────────────────
export type Profile = {
  id: string;
  username: string | null;
  level: string;
  oven_type: string | null;
  mixer_type: string | null;
  pref_style: string | null;
  language: string;
  notifs: boolean;
};

export type BakeSession = {
  id: string; style_id: string; pizzas: number; ball_size_g: number;
  hyd_pct: number; salt_pct: number; oil_pct: number;
  ferment_h: number; ferment_temp: number;
  flour_g: number; water_g: number; salt_g: number; oil_g: number; yeast_g: number;
  started_at: string | null; ready_at: string | null; completed_at: string | null;
  status: string; created_at: string;
};

export type JournalEntry = {
  id: string; session_id: string | null; title: string; style_id: string;
  date: string; rating: number; notes: string | null; photo_url: string | null;
  created_at: string;
};

export type ShoppingItem = {
  id: string; list_id: string; name: string; qty: string;
  unit: string; category: string; checked: boolean;
};

// ── Profile ───────────────────────────────────────────────────────────────
export async function getProfile(): Promise<Profile> {
  const rows = await sql`SELECT * FROM profile WHERE id = 'me' LIMIT 1`;
  return rows[0] as Profile;
}

export async function saveProfile(p: Partial<Profile>) {
  const entries = Object.entries(p);
  if (!entries.length) return;
  // Build SET clause dynamically
  const sets = entries.map(([k], i) => `${k} = $${i + 1}`).join(', ');
  const vals = entries.map(([, v]) => v);
  await sql(`UPDATE profile SET ${sets} WHERE id = 'me'`, vals);
}

// ── Bake sessions ─────────────────────────────────────────────────────────
export async function createBakeSession(s: Omit<BakeSession, 'created_at'>) {
  await sql`
    INSERT INTO bake_sessions
      (id,style_id,pizzas,ball_size_g,hyd_pct,salt_pct,oil_pct,ferment_h,ferment_temp,
       flour_g,water_g,salt_g,oil_g,yeast_g,started_at,ready_at,status)
    VALUES
      (${s.id},${s.style_id},${s.pizzas},${s.ball_size_g},${s.hyd_pct},${s.salt_pct},
       ${s.oil_pct},${s.ferment_h},${s.ferment_temp},${s.flour_g},${s.water_g},
       ${s.salt_g},${s.oil_g},${s.yeast_g},${s.started_at},${s.ready_at},${s.status})
  `;
}

export async function updateBakeStatus(id: string, status: string, completedAt?: string) {
  await sql`
    UPDATE bake_sessions SET status = ${status}, completed_at = ${completedAt ?? null}
    WHERE id = ${id}
  `;
}

export async function getActiveSession(): Promise<BakeSession | null> {
  const rows = await sql`
    SELECT * FROM bake_sessions
    WHERE status NOT IN ('done','planned')
    ORDER BY created_at DESC LIMIT 1
  `;
  return (rows[0] as BakeSession) ?? null;
}

// ── Journal ───────────────────────────────────────────────────────────────
export async function addJournalEntry(e: Omit<JournalEntry, 'created_at'>) {
  await sql`
    INSERT INTO journal_entries (id,session_id,title,style_id,date,rating,notes,photo_url)
    VALUES (${e.id},${e.session_id},${e.title},${e.style_id},${e.date},${e.rating},${e.notes},${e.photo_url})
  `;
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const rows = await sql`SELECT * FROM journal_entries ORDER BY date DESC`;
  return rows as JournalEntry[];
}

// ── Shopping ──────────────────────────────────────────────────────────────
export async function getShoppingItems(listId: string): Promise<ShoppingItem[]> {
  const rows = await sql`
    SELECT * FROM shopping_items WHERE list_id = ${listId}
    ORDER BY category, name
  `;
  return rows as ShoppingItem[];
}

export async function toggleShoppingItem(id: string, checked: boolean) {
  await sql`UPDATE shopping_items SET checked = ${checked} WHERE id = ${id}`;
}

export async function upsertShoppingItems(items: Omit<ShoppingItem, 'checked'>[]) {
  for (const it of items) {
    await sql`
      INSERT INTO shopping_items (id,list_id,name,qty,unit,category,checked)
      VALUES (${it.id},${it.list_id},${it.name},${it.qty},${it.unit},${it.category},false)
      ON CONFLICT (id) DO NOTHING
    `;
  }
}
