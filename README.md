# LinguaConnect

A modern language-exchange platform — discover partners, match by language and
interests, and practice through real-time text chat.

MVP scope: text chat only (no voice/video calls yet).

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- Zustand for state
- Supabase (Auth, Postgres, Realtime, Storage)

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in your Supabase project's
   URL and anon key:
   ```
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```
3. Apply the database schema (see `supabase/migrations/`):
   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```
4. Run the app:
   ```bash
   npm run dev
   ```

Without Supabase configured, the app runs in a demo/mock-data mode so the UI
is still browsable.

## Social login (Google / Apple / Facebook)

The app code is ready for all three providers. Enabling them requires
provider credentials configured in your Supabase project — see
[`supabase/OAUTH_SETUP.md`](supabase/OAUTH_SETUP.md) for the full walkthrough.
