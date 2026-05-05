import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('johnny-hub.db');

export function initDB() {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS profile (
      id          TEXT PRIMARY KEY DEFAULT 'me',
      username    TEXT,
      level       TEXT DEFAULT 'Principiante',
      oven_type   TEXT,
      mixer_type  TEXT,
      pref_style  TEXT,
      language    TEXT DEFAULT 'es',
      notifs      INTEGER DEFAULT 1,
      created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bake_sessions (
      id           TEXT PRIMARY KEY,
      style_id     TEXT,
      pizzas       INTEGER,
      ball_size_g  INTEGER,
      hyd_pct      REAL,
      salt_pct     REAL,
      oil_pct      REAL,
      ferment_h    INTEGER,
      ferment_temp INTEGER,
      flour_g      INTEGER,
      water_g      INTEGER,
      salt_g       REAL,
      oil_g        REAL,
      yeast_g      REAL,
      started_at   TEXT,
      ready_at     TEXT,
      completed_at TEXT,
      status       TEXT DEFAULT 'planned',
      created_at   TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id          TEXT PRIMARY KEY,
      session_id  TEXT REFERENCES bake_sessions(id),
      title       TEXT,
      style_id    TEXT,
      date        TEXT,
      rating      REAL,
      notes       TEXT,
      photo_url   TEXT,
      created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS shopping_items (
      id        TEXT PRIMARY KEY,
      list_id   TEXT,
      name      TEXT,
      qty       TEXT,
      unit      TEXT,
      category  TEXT,
      checked   INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS saved_recipes (
      recipe_id  TEXT PRIMARY KEY,
      saved_at   TEXT DEFAULT (datetime('now'))
    );

    INSERT OR IGNORE INTO profile (id) VALUES ('me');
  `);
}

// ── Profile ────────────────────────────────────────────────────────────────
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

export function getProfile(): Profile {
  const row = db.getFirstSync<any>('SELECT * FROM profile WHERE id = ?', ['me']);
  return { ...row, notifs: !!row?.notifs };
}

export function saveProfile(p: Partial<Profile>) {
  const fields = Object.keys(p).map(k => `${k} = ?`).join(', ');
  db.runSync(`UPDATE profile SET ${fields} WHERE id = 'me'`, Object.values(p));
}

// ── Bake sessions ─────────────────────────────────────────────────────────
export type BakeSession = {
  id: string;
  style_id: string;
  pizzas: number;
  ball_size_g: number;
  hyd_pct: number;
  salt_pct: number;
  oil_pct: number;
  ferment_h: number;
  ferment_temp: number;
  flour_g: number;
  water_g: number;
  salt_g: number;
  oil_g: number;
  yeast_g: number;
  started_at: string | null;
  ready_at: string | null;
  completed_at: string | null;
  status: string;
  created_at: string;
};

export function createBakeSession(s: Omit<BakeSession, 'created_at'>): void {
  db.runSync(
    `INSERT INTO bake_sessions
      (id,style_id,pizzas,ball_size_g,hyd_pct,salt_pct,oil_pct,ferment_h,ferment_temp,
       flour_g,water_g,salt_g,oil_g,yeast_g,started_at,ready_at,status)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [s.id, s.style_id, s.pizzas, s.ball_size_g, s.hyd_pct, s.salt_pct, s.oil_pct,
     s.ferment_h, s.ferment_temp, s.flour_g, s.water_g, s.salt_g, s.oil_g, s.yeast_g,
     s.started_at, s.ready_at, s.status]
  );
}

export function updateBakeStatus(id: string, status: string, completedAt?: string) {
  db.runSync(
    'UPDATE bake_sessions SET status = ?, completed_at = ? WHERE id = ?',
    [status, completedAt ?? null, id]
  );
}

export function getActiveSession(): BakeSession | null {
  return db.getFirstSync<BakeSession>(
    "SELECT * FROM bake_sessions WHERE status NOT IN ('done','planned') ORDER BY created_at DESC LIMIT 1"
  );
}

// ── Journal ───────────────────────────────────────────────────────────────
export type JournalEntry = {
  id: string;
  session_id: string | null;
  title: string;
  style_id: string;
  date: string;
  rating: number;
  notes: string | null;
  photo_url: string | null;
  created_at: string;
};

export function addJournalEntry(e: Omit<JournalEntry, 'created_at'>): void {
  db.runSync(
    `INSERT INTO journal_entries (id,session_id,title,style_id,date,rating,notes,photo_url)
     VALUES (?,?,?,?,?,?,?,?)`,
    [e.id, e.session_id, e.title, e.style_id, e.date, e.rating, e.notes, e.photo_url]
  );
}

export function getJournalEntries(): JournalEntry[] {
  return db.getAllSync<JournalEntry>(
    'SELECT * FROM journal_entries ORDER BY date DESC'
  );
}

// ── Shopping ──────────────────────────────────────────────────────────────
export type ShoppingItem = {
  id: string; list_id: string; name: string;
  qty: string; unit: string; category: string; checked: boolean;
};

export function getShoppingItems(listId: string): ShoppingItem[] {
  return db.getAllSync<any>(
    'SELECT * FROM shopping_items WHERE list_id = ? ORDER BY category, name',
    [listId]
  ).map(r => ({ ...r, checked: !!r.checked }));
}

export function toggleShoppingItem(id: string, checked: boolean) {
  db.runSync('UPDATE shopping_items SET checked = ? WHERE id = ?', [checked ? 1 : 0, id]);
}

export function upsertShoppingItems(items: Omit<ShoppingItem, 'checked'>[]) {
  for (const it of items) {
    db.runSync(
      `INSERT OR REPLACE INTO shopping_items (id,list_id,name,qty,unit,category,checked)
       VALUES (?,?,?,?,?,?,0)`,
      [it.id, it.list_id, it.name, it.qty, it.unit, it.category]
    );
  }
}

export default db;
