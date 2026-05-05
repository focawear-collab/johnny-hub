-- Johnny Hub — Neon Postgres schema
-- Ejecutar una sola vez: psql $NEON_URL -f schema.sql

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
);

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
);

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
);

CREATE TABLE IF NOT EXISTS shopping_items (
  id       TEXT PRIMARY KEY,
  list_id  TEXT,
  name     TEXT,
  qty      TEXT,
  unit     TEXT,
  category TEXT,
  checked  BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS saved_recipes (
  recipe_id TEXT PRIMARY KEY,
  saved_at  TIMESTAMPTZ DEFAULT now()
);

INSERT INTO profile (id) VALUES ('me') ON CONFLICT DO NOTHING;
