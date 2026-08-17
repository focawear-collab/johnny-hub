# johnny-hub

App móvil **Expo / React Native** ("Johnny Hub") con backend **Supabase**. Expo Router
(carpeta `app/`), multiplataforma iOS / Android / web, i18n en 3 idiomas (en / es / it).

> Estado: repo **dormido** (último commit 2026-05-05). Verificar dependencias y
> credenciales Supabase antes de retomar.

## Comandos
```bash
npm start            # expo start
npm run ios          # expo start --ios
npm run android      # expo start --android
npm run web          # expo start --web
npm run build:web    # expo export --platform web
npm test             # jest (una pasada)
```

## Layout
- `app/` — rutas Expo Router: `(tabs)/`, `livebake`, `pairings`, `recipe`, `search`,
  `profile`, `onboarding`
- `components/` — UI: `Button`, `Card`, `Chip`, `Stepper`, `TopBar`, `icons/`
- `hooks/` — `useAuth`, `useCalc`, `useJournal`, `useProfile`, `useTimer`
- `lib/` — `supabase.ts`, `db.ts`, `images.ts`, `notifications.ts`
- `constants/` — `calc.ts`, `data.ts`, `tokens.ts` (design tokens)
- `i18n/` — `en.json`, `es.json`, `it.json`
- `supabase/` — `config.toml`, `migrations/`; schema en `schema.sql` (raíz)

## Notas
- Sin README: este archivo es el índice de entrada.
- Deploy web vía Vercel (`vercel.json`). Backend/auth en Supabase (revisar migraciones antes de tocar `schema.sql`).
