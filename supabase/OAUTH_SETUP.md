# Social Login Setup (Google / Apple / Facebook)

The app code is ready — `SocialAuthButtons` calls `supabase.auth.signInWithOAuth()`
for all three providers, and `005_oauth_profiles.sql` makes sure a `profiles`
row (with name + avatar pulled from the provider) is created automatically on
first sign-in. What's left is enabling each provider in the **Supabase
Dashboard**, since that requires credentials from Google/Apple/Meta that
can't be set from code.

Run the migrations first:

```bash
supabase db push
# or, against a remote project:
supabase link --project-ref <your-project-ref>
supabase db push
```

Then, in **Supabase Dashboard → Authentication → URL Configuration**, set:

- **Site URL**: your production URL (e.g. `https://your-app.com`)
- **Redirect URLs**: add `http://localhost:3000` (or your dev port) for local
  testing, plus your production URL. Every domain the app can run on needs to
  be listed here or the OAuth redirect will be rejected.

## Google

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services
   → Credentials → **Create Credentials → OAuth client ID** → type **Web
   application**.
2. Authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
   (find your exact callback URL in Supabase Dashboard → Authentication →
   Providers → Google — it's shown there).
3. Copy the **Client ID** and **Client Secret** into Supabase Dashboard →
   Authentication → Providers → **Google**, toggle it on, save.

## Apple

Apple is the most involved of the three:

1. In your [Apple Developer](https://developer.apple.com/account) account,
   create an **App ID** with "Sign in with Apple" enabled.
2. Create a **Services ID** — this is the one you'll register as a separate
   identifier for web sign-in. Configure it with your domain and the same
   Supabase callback URL: `https://<your-project-ref>.supabase.co/auth/v1/callback`.
3. Create a **Sign in with Apple key** (Keys section) and download the `.p8`
   private key — you only get to download it once.
4. In Supabase Dashboard → Authentication → Providers → **Apple**, fill in:
   Services ID (as the Client ID), Team ID, Key ID, and the contents of the
   `.p8` file.

## Facebook

1. [Meta for Developers](https://developers.facebook.com/) → Create App →
   type "Consumer" → add the **Facebook Login** product.
2. Valid OAuth Redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`.
3. Copy the **App ID** and **App Secret** into Supabase Dashboard →
   Authentication → Providers → **Facebook**, toggle it on, save.
4. While the app is in Meta's "Development" mode only accounts added as
   testers/developers on the Facebook app can log in — submit for App Review
   (Basic permissions only, no extra scopes needed) before launch.

## Notes

- No `.env` changes are needed on the client — provider credentials live only
  in the Supabase project, not in this repo.
- All three flows land back on `/` after auth; `App.tsx` already routes a
  freshly-created (no `onboarding_completed`) user into `OnboardingPage`
  automatically, same as email/password sign-up.
- If a provider isn't enabled yet in the dashboard, clicking its button in
  the app will show a Supabase error toast rather than crash the app.
