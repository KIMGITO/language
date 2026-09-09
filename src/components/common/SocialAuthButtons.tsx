import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import type { OAuthProvider } from '../../services/authService';
import { cn } from '../../lib/utils';

// Brand marks kept as inline SVGs (lucide-react ships generic icons only,
// not trademarked logos) so no extra icon dependency is needed.
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11C3.25 21.3 7.28 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27a7.2 7.2 0 0 1-.38-2.27c0-.79.14-1.55.38-2.27V6.62H1.27A11.98 11.98 0 0 0 0 12c0 1.94.47 3.77 1.27 5.38l4-3.11z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.28 0 3.25 2.7 1.27 6.62l4 3.11C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.462 2.24-1.213 3.05-.83.9-2.18 1.6-3.29 1.51-.14-1.1.42-2.26 1.19-3.02.85-.86 2.28-1.5 3.31-1.54zM20.6 17.19c-.55 1.27-.81 1.83-1.52 2.95-.99 1.56-2.39 3.51-4.12 3.53-1.53.02-1.93-1-4-.99-2.07.01-2.5 1.01-4.03.99-1.73-.02-3.06-1.78-4.05-3.34C.16 16.86-.6 12.29 1.28 9.24c1.02-1.66 2.85-2.71 4.83-2.74 1.66-.03 3.23 1.12 4.24 1.12 1 0 2.9-1.38 4.9-1.18.83.03 3.17.34 4.67 2.55-.12.08-2.79 1.63-2.76 4.85.03 3.85 3.38 5.13 3.44 5.15-.03.09-.53 1.83-1.75 3.6z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.25h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07z"
      />
    </svg>
  );
}

const PROVIDERS: { id: OAuthProvider; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'google', label: 'Google', icon: GoogleIcon },
  { id: 'apple', label: 'Apple', icon: AppleIcon },
  { id: 'facebook', label: 'Facebook', icon: FacebookIcon },
];

interface SocialAuthButtonsProps {
  /** e.g. "Sign in" / "Sign up" — used in the aria-label only */
  actionLabel?: string;
  className?: string;
}

export function SocialAuthButtons({ actionLabel = 'Continue', className }: SocialAuthButtonsProps) {
  const { loginWithOAuth, loading } = useAuthStore();
  const [pending, setPending] = React.useState<OAuthProvider | null>(null);

  const handleClick = async (provider: OAuthProvider) => {
    setPending(provider);
    const ok = await loginWithOAuth(provider);
    // On success the browser navigates away to the provider, so this only
    // reliably runs again if it failed before the redirect kicked off.
    if (!ok) setPending(null);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="grid grid-cols-3 gap-2.5">
        {PROVIDERS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            disabled={loading}
            onClick={() => handleClick(id)}
            aria-label={`${actionLabel} with ${label}`}
            className={cn(
              'inline-flex items-center justify-center h-11 rounded-xl border border-slate-200 bg-white',
              'text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-all',
              'disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]'
            )}
          >
            {pending === id ? (
              <span className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
            ) : (
              <Icon className="h-5 w-5" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
